"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authStorage } from "@/lib/auth";
import { executeCode, getSupportedLanguages } from "@/lib/code-executor";
import { Play, Copy, Terminal, Code2, Sparkles, CheckCircle2 } from "lucide-react";

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
  typescript: `// TypeScript Example
function hello(): void {
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
};

function PlaygroundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUser = authStorage.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    const langParam = searchParams.get("lang");
    const codeParam = searchParams.get("code");
    const taskParam = searchParams.get("task");

    if (taskParam) {
      setCurrentTask(taskParam);
    }

    if (langParam && LANGUAGE_TEMPLATES[langParam.toLowerCase()]) {
      const validLang = langParam.toLowerCase();
      setLanguage(validLang);
      if (codeParam) {
        setCode(codeParam);
      } else {
        setCode(LANGUAGE_TEMPLATES[validLang]);
      }
    } else if (codeParam) {
      setCode(codeParam);
    }
  }, [searchParams]);

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
        "Failed to execute code. Please check your network and try again.",
      );
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading Code Playground...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Live Execution Sandbox
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Interactive Code Playground
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Execute code directly in your browser with real-time feedback
              </p>
            </div>
            {currentTask && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 max-w-md">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 block mb-0.5">Active Assignment</span>
                <p className="text-xs font-medium text-white truncate">{currentTask}</p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Languages */}
            <Card className="bg-slate-900/60 border border-white/[0.08] lg:col-span-1 h-fit backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-white/[0.08]">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Select Language
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-1.5 max-h-[480px] overflow-y-auto">
                {Object.keys(LANGUAGE_TEMPLATES).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between ${
                      language === lang
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                        : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{lang}</span>
                    {language === lang && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Editor and Output Area */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-2xl">
                <CardHeader className="px-4 py-3 border-b border-white/[0.08] bg-slate-950/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400">
                      main.{language === "python" ? "py" : language === "javascript" ? "js" : language === "typescript" ? "ts" : language}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setCode("")}
                      variant="outline"
                      className="h-8 text-xs border-white/10 text-slate-300 hover:bg-white/[0.06]"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={copyCode}
                      className="h-8 text-xs bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10"
                    >
                      <Copy size={13} className="mr-1.5" /> {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={14}
                    className="w-full bg-slate-950 text-emerald-400 p-4 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                    spellCheck={false}
                  />
                </CardContent>
              </Card>

              {/* Run Action */}
              <Button
                onClick={handleRunCode}
                disabled={running}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-500/25 border-0 transition-all"
              >
                {running ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Executing Code...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play size={18} fill="currentColor" />
                    <span>Run Code</span>
                  </div>
                )}
              </Button>

              {/* Console Output */}
              {output && (
                <Card className="bg-slate-900/60 border border-emerald-500/30 backdrop-blur-xl overflow-hidden">
                  <CardHeader className="py-2.5 px-4 bg-emerald-500/10 border-b border-emerald-500/20">
                    <CardTitle className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Terminal size={14} /> Output Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 bg-slate-950">
                    <pre className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-auto">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Error Output */}
              {error && (
                <Card className="bg-slate-900/60 border border-rose-500/30 backdrop-blur-xl overflow-hidden">
                  <CardHeader className="py-2.5 px-4 bg-rose-500/10 border-b border-rose-500/20">
                    <CardTitle className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      Execution Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 bg-slate-950">
                    <pre className="text-rose-400 font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-auto">
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

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Playground...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}
