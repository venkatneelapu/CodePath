"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authStorage } from "@/lib/auth";
import { executeCode, getSupportedLanguages } from "@/lib/code-executor";
import { Play, Download, Copy, Settings, AlertCircle } from "lucide-react";

const LANGUAGE_TEMPLATES = {
  python: `# Python Example
def hello():
    print("Hello, World!")

hello()`,
  javascript: `// JavaScript Example
function hello() {
    console.log("Hello, World!");
}

hello();`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  ruby: `puts "Hello, World!"`,
  php: `<?php
echo "Hello, World!";
?>`,
  rust: `fn main() {
    println!("Hello, World!");
}`,
  typescript: `function hello(): void {
    console.log("Hello, World!");
}

hello();`,
};

export default function PlaygroundPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dracula");

  useEffect(() => {
    const currentUser = authStorage.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang]);
    setOutput("");
    setError("");
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput("");
    setError("");

    try {
      const result = await executeCode(code, language);

      if (result.success) {
        setOutput(result.output || "Code executed successfully");
      } else {
        setError(result.output || "Failed to execute code");
      }
    } catch (err) {
      setError(
        "Failed to execute code. Please check your internet connection and try again.",
      );
    } finally {
      setRunning(false);
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-white mb-2 gradient-text">
            Code Playground
          </h1>
          <p className="text-slate-300 mb-8 text-lg">
            Practice any programming language with a full-featured IDE
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <Card className="glass-card border border-indigo-500/30 lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-white">Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(LANGUAGE_TEMPLATES).map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full justify-start ${language === lang ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-700 hover:bg-slate-600"} text-white`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Editor and Output */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border border-indigo-500/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Code Editor</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setCode("")}
                      variant="outline"
                      className="border-indigo-500/30 text-slate-300 hover:bg-slate-700"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(code)}
                      className="bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <Copy size={16} className="mr-2" /> Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-80 bg-slate-950 text-cyan-400 p-4 rounded-lg border border-indigo-500/20 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </CardContent>
              </Card>

              <Button
                onClick={handleRunCode}
                disabled={running}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-bold"
              >
                <Play size={20} className="mr-2" />
                {running ? "Running..." : "Run Code"}
              </Button>

              {output && (
                <Card className="glass-card border border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-green-400 p-4 rounded-lg border border-green-500/20 font-mono text-sm overflow-auto">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card className="glass-card border border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-400">Error</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-red-400 p-4 rounded-lg border border-red-500/20 font-mono text-sm overflow-auto">
                      {error}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
