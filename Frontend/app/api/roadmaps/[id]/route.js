import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { withAuthMiddleware, validateRequestBody } from "@/lib/api-middleware";
import { updateRoadmapSchema } from "@/lib/validation-schemas";
import { toObjectId, isValidObjectId } from "@/lib/auth-utils";

// GET specific roadmap
async function handleGet(req, { user_id, params }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid roadmap ID" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const roadmapId = toObjectId(id);
    const userId = toObjectId(user_id);

    // Get roadmap
    const roadmap = await db.collection("roadmaps").findOne({
      _id: roadmapId,
      user_id: userId,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: "Roadmap not found" },
        { status: 404 },
      );
    }

    // Get modules
    const modules = await db
      .collection("modules")
      .find({ roadmap_id: roadmapId })
      .sort({ module_order: 1 })
      .toArray();

    // Get progress for modules
    const progressMap = await db
      .collection("progress")
      .find({
        user_id: userId,
        module_id: { $in: modules.map((m) => m._id) },
      })
      .toArray()
      .then((docs) =>
        docs.reduce((map, doc) => {
          map[doc.module_id.toString()] = doc;
          return map;
        }, {}),
      );

    const modulesWithProgress = modules.map((module) => ({
      ...module,
      _id: module._id.toString(),
      roadmap_id: module.roadmap_id.toString(),
      progress: progressMap[module._id.toString()],
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          ...roadmap,
          _id: roadmap._id.toString(),
          user_id: roadmap.user_id.toString(),
          modules: modulesWithProgress,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get roadmap error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT update roadmap
async function handlePut(req, { user_id, params }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid roadmap ID" },
        { status: 400 },
      );
    }

    const validation = await validateRequestBody(req, updateRoadmapSchema);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error,
        },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const roadmapId = toObjectId(id);
    const userId = toObjectId(user_id);

    // Verify ownership
    const roadmap = await db.collection("roadmaps").findOne({
      _id: roadmapId,
      user_id: userId,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: "Roadmap not found" },
        { status: 404 },
      );
    }

    // Update roadmap
    const result = await db.collection("roadmaps").findOneAndUpdate(
      { _id: roadmapId },
      {
        $set: {
          ...validation.data,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Roadmap updated successfully",
        data: {
          ...result.value,
          _id: result.value._id.toString(),
          user_id: result.value.user_id.toString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update roadmap error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE roadmap
async function handleDelete(req, { user_id, params }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid roadmap ID" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();
    const roadmapId = toObjectId(id);
    const userId = toObjectId(user_id);

    // Verify ownership
    const roadmap = await db.collection("roadmaps").findOne({
      _id: roadmapId,
      user_id: userId,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: "Roadmap not found" },
        { status: 404 },
      );
    }

    // Delete roadmap and related data
    await db.collection("roadmaps").deleteOne({ _id: roadmapId });

    // Get modules to delete
    const modules = await db
      .collection("modules")
      .find({ roadmap_id: roadmapId })
      .toArray();

    // Delete modules
    await db.collection("modules").deleteMany({ roadmap_id: roadmapId });

    // Delete progress
    await db.collection("progress").deleteMany({
      module_id: { $in: modules.map((m) => m._id) },
    });

    return NextResponse.json(
      { success: true, message: "Roadmap deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete roadmap error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = async (req, context) => {
  const resolvedParams = await context.params;
  return withAuthMiddleware((r, authContext) =>
    handleGet(r, { ...authContext, params: resolvedParams }),
  )(req);
};

export const PUT = async (req, context) => {
  const resolvedParams = await context.params;
  return withAuthMiddleware((r, authContext) =>
    handlePut(r, { ...authContext, params: resolvedParams }),
  )(req);
};

export const DELETE = async (req, context) => {
  const resolvedParams = await context.params;
  return withAuthMiddleware((r, authContext) =>
    handleDelete(r, { ...authContext, params: resolvedParams }),
  )(req);
};
