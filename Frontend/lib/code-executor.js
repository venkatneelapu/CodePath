// Code executor utility with local API fallback
// Uses the local /api/execute endpoint which proxies to Piston API

export const executeCode = async (code, language) => {
  if (!code || code.trim().length === 0) {
    return { success: false, output: "Code cannot be empty" };
  }

  try {
    // Use local API route
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        language: language,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[Code Executor] Error:", error.message);
    return {
      success: false,
      output:
        "Unable to execute code. Please check your internet connection and try again.",
    };
  }
};

export const validateCode = (code, language) => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Code cannot be empty" };
  }

  // Check for potentially dangerous code patterns
  if (language === "python") {
    // Block dangerous Python functions
    const dangerousPatterns = [
      { pattern: "__import__", message: "__import__ is not allowed" },
      { pattern: "exec(", message: "exec() is not allowed" },
      { pattern: "eval(", message: "eval() is not allowed" },
      { pattern: "subprocess", message: "subprocess module is not allowed" },
      { pattern: "os.system", message: "os.system is not allowed" },
      { pattern: "open(", message: "File operations are not allowed" },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (code.includes(pattern)) {
        return { valid: false, error: message };
      }
    }
  } else if (language === "javascript") {
    // Block dangerous JavaScript functions
    const dangerousPatterns = [
      { pattern: "eval(", message: "eval() is not allowed" },
      { pattern: "Function(", message: "Function constructor is not allowed" },
      { pattern: "fetch(", message: "Network requests are not allowed" },
      {
        pattern: "XMLHttpRequest",
        message: "Network requests are not allowed",
      },
      { pattern: "require(", message: "require() is not allowed" },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (code.includes(pattern)) {
        return { valid: false, error: message };
      }
    }
  }

  return { valid: true };
};

// Helper for getting language-specific starter code
export const getStarterCode = (language) => {
  const templates = {
    python: 'print("Hello, World!")',
    javascript: 'console.log("Hello, World!");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    typescript: 'console.log("Hello, World!");',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    ruby: 'puts "Hello, World!"',
    php: '<?php\necho "Hello, World!";\n?>',
  };

  return templates[language] || templates.python;
};

// Get supported languages
export const getSupportedLanguages = () => [
  { id: "python", name: "Python", ext: "py" },
  { id: "javascript", name: "JavaScript", ext: "js" },
  { id: "java", name: "Java", ext: "java" },
  { id: "typescript", name: "TypeScript", ext: "ts" },
  { id: "go", name: "Go", ext: "go" },
  { id: "rust", name: "Rust", ext: "rs" },
  { id: "c", name: "C", ext: "c" },
  { id: "cpp", name: "C++", ext: "cpp" },
  { id: "ruby", name: "Ruby", ext: "rb" },
  { id: "php", name: "PHP", ext: "php" },
];
