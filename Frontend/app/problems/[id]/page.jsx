"use client";

import { useState, useEffect } from "react";
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
import { codingProblems } from "@/lib/coding-problems";
import { getSelectedTheme, applyTheme } from "@/lib/theme-manager";
import { executeCode, getSupportedLanguages } from "@/lib/code-executor";

export default function ProblemPage({ params }) {
  const router = useRouter();
  const problem = codingProblems.find((p) => p.id === params.id);

  const [selectedLanguage, setSelectedLanguage] = useState(
    problem?.language || "Python",
  );
  const [code, setCode] = useState(problem?.starterCode || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const theme = getSelectedTheme();
    applyTheme(theme);
  }, []);

  const escapeHTML = (text) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  };

  const highlightCodeDisplay = (codeText, language) => {
    // Escape HTML entities first to prevent script/style tags from being interpreted
    let html = escapeHTML(codeText);

    const keywords = {
      python: [
        "def",
        "class",
        "if",
        "else",
        "elif",
        "for",
        "while",
        "return",
        "import",
        "from",
        "as",
        "True",
        "False",
        "None",
        "and",
        "or",
        "not",
        "in",
        "is",
      ],
      javascript: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "import",
        "export",
        "class",
        "async",
        "await",
        "try",
        "catch",
        "throw",
        "new",
      ],
      java: [
        "public",
        "private",
        "class",
        "interface",
        "if",
        "else",
        "for",
        "while",
        "return",
        "new",
        "static",
        "final",
        "void",
        "int",
        "String",
        "boolean",
        "try",
        "catch",
      ],
      typescript: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "import",
        "export",
        "class",
        "async",
        "await",
        "type",
        "interface",
      ],
    };

    const langKeywords = keywords[language.toLowerCase()] || [];

    langKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      html = html.replace(
        regex,
        `<span class="code-keyword">${keyword}</span>`,
      );
    });

    html = html.replace(
      /"[^"]*"/g,
      (match) => `<span class="code-string">${match}</span>`,
    );
    html = html.replace(
      /'[^']*'/g,
      (match) => `<span class="code-string">${match}</span>`,
    );
    html = html.replace(
      /\/\/.*$/gm,
      (match) => `<span class="code-comment">${match}</span>`,
    );
    html = html.replace(
      /\/\*[\s\S]*?\*\//g,
      (match) => `<span class="code-comment">${match}</span>`,
    );

    return html;
  };

  const supportedLanguages = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "C",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "TypeScript",
  ];

  const languageStarters = {
    Python: "# Write your Python code here\nprint('Hello, World!')",
    JavaScript:
      "// Write your JavaScript code here\nconsole.log('Hello, World!')",
    Java: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    "C++":
      '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    C: '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    Go: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    Rust: 'fn main() {\n    println!("Hello, World!");\n}',
    PHP: "<?php\necho 'Hello, World!';\n?>",
    Ruby: "puts 'Hello, World!'",
    TypeScript:
      "const greeting: string = 'Hello, World!';\nconsole.log(greeting);",
  };

  const handleRunCode = async () => {
    setLoading(true);
    try {
      // Map UI language names to executor language names
      const languageNameMap = {
        Python: "python",
        JavaScript: "javascript",
        Java: "java",
        "C++": "cpp",
        C: "c",
        Go: "go",
        Rust: "rust",
        PHP: "php",
        Ruby: "ruby",
        TypeScript: "typescript",
      };

      const executorLanguage = languageNameMap[selectedLanguage] || "python";

      const result = await executeCode(code, executorLanguage);

      const stdout = result.output || "";
      const success = result.success;

      setOutput(stdout || "Code executed successfully");

      const results = problem.testCases.map((testCase) => {
        const expectedOutput = testCase.expected.trim();
        const actualOutput = stdout.trim();
        const passed = actualOutput === expectedOutput;
        return {
          input: testCase.input,
          expected: testCase.expected,
          actual: stdout.trim(),
          passed,
        };
      });

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      setAllTestsPassed(allPassed);

      if (allPassed) {
        setOutput("✅ All test cases passed!");
      } else if (!success) {
        setOutput(`Error: ${stdout}`);
      } else {
        const failedCount = results.filter((r) => !r.passed).length;
        setOutput(
          `❌ ${failedCount} out of ${results.length} test cases failed`,
        );
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setTestResults([]);
      setAllTestsPassed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    setCode(languageStarters[newLanguage]);
    setTestResults([]);
    setAllTestsPassed(false);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{problem.title}</span>
                  <span
                    className={`text-sm px-3 py-1 rounded ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : problem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </CardTitle>
                <CardDescription>{problem.category}</CardDescription>
                {problem.companies && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <span
                        key={company}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {problem.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Explanation</h3>
                  <p className="text-sm text-muted-foreground">
                    {problem.explanation}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Test Cases</h3>
                  <div className="space-y-2">
                    {problem.testCases.map((testCase, idx) => (
                      <div key={idx} className="text-sm bg-muted p-2 rounded">
                        <p>
                          <strong>Input:</strong> {testCase.input}
                        </p>
                        <p>
                          <strong>Expected:</strong> {testCase.expected}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  variant="outline"
                  className="w-full"
                >
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </Button>

                {showSolution && (
                  <div className="bg-muted p-3 rounded code-editor">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code className="text-foreground">
                        {problem.solutions?.[selectedLanguage] ||
                          problem.solution ||
                          "Solution not available in this language"}
                      </code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <div className="mt-4">
                  <label className="text-sm font-medium block mb-2">
                    Select Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full p-2 border rounded bg-background"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 p-4 rounded border font-mono text-sm code-editor"
                  style={{
                    backgroundColor: "var(--code-bg)",
                    color: "var(--code-text)",
                    fontFamily: "'Monaco', 'Courier New', monospace",
                    fontSize: `${fontSize}px`,
                    lineHeight: "1.5",
                    resize: "vertical",
                  }}
                  placeholder={`Write your ${selectedLanguage} code here...`}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleRunCode}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    onClick={() => setCode(languageStarters[selectedLanguage])}
                    variant="outline"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>

                <div
                  className={`bg-muted p-3 rounded code-output ${
                    allTestsPassed
                      ? "border border-green-500"
                      : testResults.length > 0
                        ? "border border-red-500"
                        : ""
                  }`}
                  style={{
                    backgroundColor: "var(--code-bg)",
                    color: "var(--code-text)",
                    fontFamily: "'Monaco', 'Courier New', monospace",
                  }}
                >
                  {output || "Run code to see output..."}
                </div>

                {testResults.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Test Results</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {testResults.map((result, idx) => (
                        <div
                          key={idx}
                          className={`text-sm p-2 rounded ${
                            result.passed
                              ? "bg-green-100 border border-green-500"
                              : "bg-red-100 border border-red-500"
                          }`}
                        >
                          <p className="font-semibold">
                            {result.passed ? "✅" : "❌"} Test Case {idx + 1}
                          </p>
                          <p>
                            <strong>Input:</strong> {result.input}
                          </p>
                          <p>
                            <strong>Expected:</strong> {result.expected}
                          </p>
                          {!result.passed && (
                            <p className="text-red-700">
                              <strong>Got:</strong> {result.actual || "(empty)"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
