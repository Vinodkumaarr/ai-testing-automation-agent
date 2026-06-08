import { db } from "@/db";
import { TestCasesTable, repositories } from "@/db/schema";
import Browserbase from "@browserbasehq/sdk";
import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!,
});

// Utility: read file from GitHub
async function readGithubFile({
  owner,
  repo,
  path,
  branch,
  githubToken,
}: {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  githubToken: string;
}) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!res.ok) return null;

  const data = await res.json();

  if (!data.content) {
    return null;
  }

  const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");

  return {
    path,
    content: decodedContent.slice(0, 5000),
  };
}

// API route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { testCaseId, baseUrl, mode = "generate", customPrompt = "" } = body;

    if (!testCaseId || !baseUrl) {
      return NextResponse.json(
        { error: "testCaseId and baseUrl are required" },
        { status: 400 },
      );
    }

    // 1. Fetch test case from DB
    const [testCase] = await db
      .select()
      .from(TestCasesTable)
      .where(eq(TestCasesTable.id, testCaseId));

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 },
      );
    }

    // 2. Fetch repository settings
    let repoRecord = null;

    if (testCase.repoId) {
      const [r] = await db
        .select()
        .from(repositories)
        .where(eq(repositories.repoId, parseInt(testCase.repoId)));

      repoRecord = r;
    }

    if (!repoRecord) {
      const [r] = await db
        .select()
        .from(repositories)
        .where(
          eq(
            repositories.fullName,
            `${testCase.repoOwner}/${testCase.repoName}`,
          ),
        );

      repoRecord = r;
    }

    let scriptText = testCase.browserbaseScript;
    const forceRegenerate = mode === "generate" || !scriptText;

    // 3. Generate script if forced or missing
    if (forceRegenerate) {
      const cookiesStore = await cookies();
      const githubToken = cookiesStore.get("gh_token")?.value;

      if (!githubToken) {
        return NextResponse.json(
          {
            error: "Github authentication token is missing or expired",
          },
          { status: 401 },
        );
      }

      const targetFiles = testCase.targetFiles || [];
      let repoContext = "";

      if (targetFiles.length > 0) {
        const fileContents = await Promise.all(
          targetFiles.map((path: string) =>
            readGithubFile({
              owner: testCase.repoOwner,
              repo: testCase.repoName,
              branch: testCase.branch || "main",
              path,
              githubToken,
            }),
          ),
        );

        const validFiles = fileContents.filter(Boolean);

        repoContext = validFiles
          .map(
            (file: any) => `
File Path: ${file.path}

File Content:
${file.content}
`,
          )
          .join("\n\n---------\n\n");
      }

      const globalIns = repoRecord?.globalInstruction
        ? `
[GLOBAL PROJECT INSTRUCTIONS] (Follow strictly):
${repoRecord.globalInstruction}
`
        : "";

      const tempIns = customPrompt
        ? `
[ADDITIONAL RUNTIME INSTRUCTIONS] (Follow strictly):
${customPrompt}
`
        : "";

      const prompt = `
You are an expert QA automation engineer.

Your task is to write a Playwright Node.js script body that executes a test case on an application.

Test Case Details:
Title: ${testCase.title}
Description: ${testCase.description}
Target Route: ${testCase.targetRoute || "/"}
Expected Result: ${testCase.expectedResult}

${globalIns}

${tempIns}

Source File Context for Reference:
${repoContext || "No source file context available for this test case."}

Write only the JavaScript code that executes within an async function context.

The following variables are pre-injected:

- page
- console

IMPORTANT:

Do NOT assume Node.js assert is available.
Do NOT import anything.

At the top of the generated script define:

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

Rules:

- DO NOT import playwright, browserbase, assert, or any modules.

- Navigate using:

await page.goto(
  '${baseUrl}${testCase.targetRoute || ""}',
  {
    waitUntil: "load",
    timeout: 15000
  }
);

await page.waitForTimeout(1000);

- Analyze Source File Context carefully.
- Use resilient selectors.
- Wait for visibility before interactions.
- Scroll elements into view before clicks.
- Use force click fallback if necessary.
- Add waits after major actions.
- Use relaxed assertions.

Example:

const bodyText = await page.innerText("body");

assert(
  bodyText
    .toLowerCase()
    .includes(
      "${(testCase.expectedResult || "").toLowerCase().replace(/"/g, '\\"')}"
    ),
  "Expected result state not matched"
);

- Log steps using console.log().
- Return ONLY executable JavaScript code.
- No markdown.
- No explanations.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      let generatedCode = response.text || "";

      generatedCode = generatedCode
        .replace(/^```javascript\s*/i, "")
        .replace(/^```js\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      if (!generatedCode) {
        return NextResponse.json(
          {
            error: "Gemini failed to generate an automation script",
          },
          { status: 500 },
        );
      }

      scriptText = generatedCode;

      await db
        .update(TestCasesTable)
        .set({
          browserbaseScript: scriptText,
          status: "running",
        })
        .where(eq(TestCasesTable.id, testCase.id));
    }

    // Custom console + logs
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) =>
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        ),

      error: (...args: any[]) =>
        logs.push(
          "[ERROR] " +
            args
              .map((a) =>
                typeof a === "object" ? JSON.stringify(a) : String(a),
              )
              .join(" "),
        ),

      warn: (...args: any[]) =>
        logs.push(
          "[WARN] " +
            args
              .map((a) =>
                typeof a === "object" ? JSON.stringify(a) : String(a),
              )
              .join(" "),
        ),
    };

    let session: any = null;
    let browser: any = null;

    try {
      // 4. Create Browserbase Session
      session = await bb.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
      });

      logs.push(
        `[SYSTEM] Browserbase session created successfully with ID: ${session.id}`,
      );

      // 5. Connect Playwright
      browser = await chromium.connectOverCDP(session.connectUrl);

      const context = browser.contexts()[0];
      const page = context.pages()[0];

      page.on("console", (msg: any) => {
        logs.push(`[BROWSER] [${msg.type().toUpperCase()}] ${msg.text()}`);
      });

      logs.push(
        "[SYSTEM] Connected to Browserbase cloud browser, executing script...",
      );

      const AsyncFunction = Object.getPrototypeOf(
        async function () {},
      ).constructor;

      const runFn = new AsyncFunction("page", "assert", "console", scriptText);

      const assertHelper = (condition: boolean, message?: string) => {
        if (!condition) {
          throw new Error(message || "Assertion failed");
        }
      };

      await runFn(page, assertHelper, customConsole);

      logs.push(
        "[SYSTEM] Script execution completed successfully without errors.",
      );

      await page.close().catch(() => {});
      await browser?.close().catch(() => {});

      await db
        .update(TestCasesTable)
        .set({
          status: "passed",
          browserbaseScript: scriptText,
          logs,
          sessionId: session.id,
          sessionUrl: `https://www.browserbase.com/sessions/${session.id}`,
        })
        .where(eq(TestCasesTable.id, testCase.id));

      return NextResponse.json({
        success: true,
        status: "passed",
        sessionId: session.id,
        sessionUrl: `https://www.browserbase.com/sessions/${session.id}`,
        logs,
        browserbaseScript: scriptText,
      });
    } catch (execError: any) {
      console.error("Script execution error:", execError);

      logs.push(
        `[SYSTEM ERROR] Script execution failed: ${
          execError.message || String(execError)
        }`,
      );

      if (browser) {
        await browser.close().catch(() => {});
      }

      await db
        .update(TestCasesTable)
        .set({
          status: "failed",
          browserbaseScript: scriptText,
          logs,
          sessionId: session?.id || null,
          sessionUrl: session
            ? `https://www.browserbase.com/sessions/${session.id}`
            : null,
        })
        .where(eq(TestCasesTable.id, testCase.id));

      return NextResponse.json(
        {
          success: false,
          status: "failed",
          error: execError.message || String(execError),
          sessionId: session?.id,
          sessionUrl: session
            ? `https://www.browserbase.com/sessions/${session.id}`
            : null,
          logs,
          browserbaseScript: scriptText,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
