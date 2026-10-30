import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";

// Execute command with timeout
const execWithTimeout = (cmd, args, options, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, options);
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      process.kill();
      reject(new Error("Execution timed out"));
    }, timeout);

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code });
    });

    process.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
};

// Execute Python code
const executePython = async (code, tempDir) => {
  const filePath = join(tempDir, "main.py");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("python", [filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    // Try python3
    try {
      const result = await execWithTimeout("python3", [filePath], {
        cwd: tempDir,
        timeout: 15000,
      });
      if (result.code !== 0 && result.stderr) {
        return { success: false, output: result.stderr };
      }
      return {
        success: true,
        output: result.stdout || "Code executed successfully",
      };
    } catch (e) {
      return {
        success: false,
        output: `Python not found. Please install Python to run code.\nError: ${e.message}`,
      };
    }
  }
};

// Execute JavaScript code
const executeJavaScript = async (code, tempDir) => {
  const filePath = join(tempDir, "main.js");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("node", [filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `Node.js not found. Please install Node.js to run code.\nError: ${error.message}`,
    };
  }
};

// Execute TypeScript code
const executeTypeScript = async (code, tempDir) => {
  const filePath = join(tempDir, "main.ts");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("npx", ["ts-node", filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code === 0) {
      return {
        success: true,
        output: result.stdout || "Code executed successfully",
      };
    }
  } catch (error) {
    // Proceed to node fallback
  }

  // Fallback to running with Node by stripping basic TypeScript syntax
  const jsCode = code
    .replace(/:\s*(string|number|boolean|void|any|unknown|never|object)\b/g, "")
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
    .replace(/type\s+\w+\s*=[^;]+;/g, "");
  const jsPath = join(tempDir, "main.js");
  await writeFile(jsPath, jsCode);

  try {
    const result = await execWithTimeout("node", [jsPath], {
      cwd: tempDir,
      timeout: 15000,
    });
    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (e) {
    return {
      success: false,
      output: `TypeScript execution failed.\nError: ${e.message}`,
    };
  }
};

// Execute Java code
const executeJava = async (code, tempDir) => {
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : "Main";
  const filePath = join(tempDir, `${className}.java`);
  await writeFile(filePath, code);

  try {
    const compileResult = await execWithTimeout("javac", [filePath], {
      cwd: tempDir,
      timeout: 15000,
    });
    if (compileResult.code !== 0 && compileResult.stderr) {
      return {
        success: false,
        output: `Compilation Error:\n${compileResult.stderr}`,
      };
    }

    const result = await execWithTimeout("java", ["-cp", tempDir, className], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `Java execution failed. Please install JDK.\nError: ${error.message}`,
    };
  }
};

// Execute Go code
const executeGo = async (code, tempDir) => {
  const filePath = join(tempDir, "main.go");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("go", ["run", filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `Go execution failed. Please install Go.\nError: ${error.message}`,
    };
  }
};

// Execute Ruby code
const executeRuby = async (code, tempDir) => {
  const filePath = join(tempDir, "main.rb");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("ruby", [filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `Ruby execution failed. Please install Ruby.\nError: ${error.message}`,
    };
  }
};

// Execute PHP code
const executePHP = async (code, tempDir) => {
  const filePath = join(tempDir, "main.php");
  await writeFile(filePath, code);

  try {
    const result = await execWithTimeout("php", [filePath], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `PHP execution failed. Please install PHP.\nError: ${error.message}`,
    };
  }
};

// Execute C code
const executeC = async (code, tempDir) => {
  const filePath = join(tempDir, "main.c");
  const exePath = join(tempDir, "main");
  await writeFile(filePath, code);

  try {
    const compileResult = await execWithTimeout(
      "gcc",
      [filePath, "-o", exePath],
      { cwd: tempDir, timeout: 15000 },
    );
    if (compileResult.code !== 0 && compileResult.stderr) {
      return {
        success: false,
        output: `Compilation Error:\n${compileResult.stderr}`,
      };
    }

    const result = await execWithTimeout(exePath, [], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `C execution failed. Please install GCC.\nError: ${error.message}`,
    };
  }
};

// Execute C++ code
const executeCpp = async (code, tempDir) => {
  const filePath = join(tempDir, "main.cpp");
  const exePath = join(tempDir, "main");
  await writeFile(filePath, code);

  try {
    const compileResult = await execWithTimeout(
      "g++",
      [filePath, "-o", exePath],
      { cwd: tempDir, timeout: 15000 },
    );
    if (compileResult.code !== 0 && compileResult.stderr) {
      return {
        success: false,
        output: `Compilation Error:\n${compileResult.stderr}`,
      };
    }

    const result = await execWithTimeout(exePath, [], {
      cwd: tempDir,
      timeout: 15000,
    });

    if (result.code !== 0 && result.stderr) {
      return { success: false, output: result.stderr };
    }
    return {
      success: true,
      output: result.stdout || "Code executed successfully",
    };
  } catch (error) {
    return {
      success: false,
      output: `C++ execution failed. Please install G++.\nError: ${error.message}`,
    };
  }
};

// Main execute function
const executeCodeLocal = async (code, language) => {
  const tempDir = mkdtempSync(join(tmpdir(), "piston-"));

  try {
    switch (language.toLowerCase()) {
      case "python":
      case "python3":
        return await executePython(code, tempDir);
      case "javascript":
      case "node":
        return await executeJavaScript(code, tempDir);
      case "typescript":
        return await executeTypeScript(code, tempDir);
      case "java":
        return await executeJava(code, tempDir);
      case "go":
        return await executeGo(code, tempDir);
      case "ruby":
        return await executeRuby(code, tempDir);
      case "php":
        return await executePHP(code, tempDir);
      case "c":
        return await executeC(code, tempDir);
      case "cpp":
      case "c++":
        return await executeCpp(code, tempDir);
      default:
        return {
          success: false,
          output: `Language '${language}' is not supported for local execution.`,
        };
    }
  } finally {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, output: "No code provided" },
        { status: 400 },
      );
    }

    if (!language) {
      return NextResponse.json(
        { success: false, output: "No language specified" },
        { status: 400 },
      );
    }

    const result = await executeCodeLocal(code, language);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Execute API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        output: `An unexpected error occurred: ${error.message}`,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, output: "Method not allowed" },
    { status: 405 },
  );
}
