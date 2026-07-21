"use server";

import { isAuthenticated } from "@/lib/auth-server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { convertBlockNoteToText } from "@/lib/utils";

type AiSummary = {
    title: string;
    content: string | undefined;
};

const SYSTEM_PROMPT = `
    You are an expert AI content summarizer integrated into a modern collaborative workspace platform (similar to Notion).

Your task is to generate a clear, concise, structured, and highly readable summary based on the provided document's Title and Content.

### INSTRUCTIONS
1. **Core Overview**: Begin with a succinct 1–2 sentence overview that captures the core theme or main purpose of the document.
2. **Key Takeaways**: Highlight 3 to 5 key points, critical insights, or action items using bullet points with bold headers.
3. **Language Matching**: Always generate the summary in the primary language of the input document (e.g., respond in Vietnamese if the input document is in Vietnamese, respond in English if the input is in English).
4. **Tone & Style**: Professional, objective, direct, and easy to scan. Use clean Markdown formatting. Do not include introductory or concluding conversational filler (e.g., avoid "Here is your summary:").
5. **Special Case**: If the document contains empty, random, or meaningless characters (e.g., test input), briefly politely state that there is not enough content to generate a summary.

### OUTPUT STRUCTURE
### 📌 Executive Summary
[1-2 sentence high-level overview]

### 💡 Key Takeaways
- **[Key Point 1]**: [Brief explanation or detail]
- **[Key Point 2]**: [Brief explanation or detail]
- **[Key Point 3]**: [Brief explanation or detail]
`;

export async function aiSummaryGenerate({ title, content }: AiSummary) {
    try {
        const isAuth = await isAuthenticated();

        if (!isAuth) {
            throw new Error("Unauthorized");
        }

        let cleanText = "";

        if (content) {
            const rawBlocks = JSON.parse(content);

            cleanText = convertBlockNoteToText(rawBlocks);
        }

        const userPrompt = `
            Title: ${title}

            Content:
            ${cleanText}
        `;

        const response = await generateText({
            model: google("gemini-2.5-flash"),
            instructions: SYSTEM_PROMPT,
            prompt: userPrompt,
        });

        return response.text;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
