"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authStorage, roadmapStorage } from "@/lib/auth";
import { predefinedRoadmaps } from "@/lib/predefined-roadmaps";

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setUser(json.data);
      } catch {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router]);

  const addRoadmap = async (predefined) => {
    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: predefined.title,
          description: predefined.description,
          topic: predefined.title,
          duration_days: predefined.steps?.length || 7,
          generateAI: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        router.push(`/roadmap/${json.data._id}`);
      } else {
        console.error("Failed to create roadmap");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Explore Roadmaps</h1>
        <p className="text-muted-foreground mb-8">
          Choose from our curated collection of learning paths
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {predefinedRoadmaps.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription>{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {roadmap.level}
                    </span>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      {roadmap.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {roadmap.steps.length} steps
                  </p>
                </div>
                <Button onClick={() => addRoadmap(roadmap)} className="w-full">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
