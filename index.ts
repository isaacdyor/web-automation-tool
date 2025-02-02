// src/index.ts
import { Stagehand, type LogLine } from "@browserbasehq/stagehand";
import { z } from "zod";

let stagehandInstance: Stagehand | null = null;

function getStagehandInstance() {
  if (!stagehandInstance) {
    stagehandInstance = new Stagehand({
      env: "LOCAL",
      verbose: 1,
      headless: true,
      enableCaching: true,
      logger: (logLine: LogLine) => {
        console.log(`[${logLine.category}] ${logLine.message}`);
      },
      modelName: "claude-3-5-sonnet-latest",
      modelClientOptions: {
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    });
  }
  return stagehandInstance;
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const stagehand = getStagehandInstance();

    if (req.url.endsWith("/execute")) {
      // Combined endpoint to generate and execute actions
      try {
        const response = await req.json();
        console.log("Received prompt for execution:", response);

        // Mock external API call to generate action
        const generatedAction = {
          instruction:
            "extract the title, description, and link of the quickstart. As well as the ceo if its mentioned",
          schema: z.object({
            title: z.string(),
            link: z.string(),
            description: z.string(),
            ceo: z.string().optional(),
          }),
        };

        console.log("Generated action:", generatedAction);

        await stagehand.init();
        const page = stagehand.page;

        // Perform the action based on the generated instruction
        await page.goto("https://docs.browserbase.com/");
        const description = await page.extract({
          instruction: generatedAction.instruction,
          schema: generatedAction.schema,
        });

        return new Response(JSON.stringify({ success: true, description }));
      } catch (error) {
        console.error("Execution failed:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message })
        );
      } finally {
        await stagehand.close();
      }
    }

    return new Response("Server running! Try /execute endpoint");
  },
});
