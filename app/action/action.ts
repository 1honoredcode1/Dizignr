"use server";

import { generateText } from "ai";

import { openrouter } from "@/lib/openrouter";

export async function generateProjectName(prompt: string) {
  try {
    const { text } = await generateText({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      system: `You are an AI assistant that generates very very short project names based on the user's prompt.
      - Keep it under 5 words.
      - Capitalize words appropriately.
      - Do not include special characters.`,
      prompt,
    });

    return text?.trim() || "Untitiled Project";
  } catch (error) {
    console.error(error);
    return "Unit Project";
  }
}
