
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { imageUrl, goal, platform, audience, language, captionLength, emojiLevel } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Fetch image from URL
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
      throw new Error("Failed to fetch image from URL");
    }
    const contentType = imageResp.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
You are “Caption AI”.

You will receive:
1) An IMAGE (photo).
2) User settings: Goal, Platform, Audience, Language, CaptionLength, EmojiLevel.

Your task:
- Understand what is happening in the image (scene, mood, key objects, activity).
- Generate outcome-based captions that match the selected Goal + Platform + Audience.
- Write captions in the requested Language.
- Follow the platform tone rules.

USER SETTINGS
Goal: ${goal}
Platform: ${platform}
Audience: ${audience}
Language: ${language}
CaptionLength: ${captionLength}   (short | medium | long)
EmojiLevel: ${emojiLevel}         (none | low | normal | high)

PLATFORM TONE RULES
- Instagram: friendly, catchy, light emojis allowed, natural.
- TikTok: short, punchy, trend-like, hook-first.
- LinkedIn: professional, clear, value-focused, minimal emojis.
- WhatsApp Status: simple, personal, short, relatable.

GOAL RULES
- get_more_comments: captions should end with an easy question or prompt for replies.
- go_viral: captions should use curiosity hooks, “wait for it”, “POV”, contrast, short lines.
- soft_sell: subtle promotion without sounding pushy; include gentle CTA.
- premium_tone: confident, elegant, minimal emojis, strong wording.
- faith_motivation: uplifting, respectful, scripture-like tone without quoting long verses.
- storytelling: first-person mini story, emotional but not cringe.

SAFETY RULES
- Do NOT identify real people or guess sensitive traits (age, race, religion, sexuality, health).
- Do NOT mention private details like exact locations or addresses.
- If the image looks like it includes a minor, keep captions strictly safe and non-suggestive.
- Avoid hate, harassment, sexual content, or violence.

OUTPUT REQUIREMENTS (VERY IMPORTANT)
Return ONLY valid JSON. No markdown. No explanations outside JSON. No trailing comments.

Return this exact JSON structure:
{
  "photo_summary": "1–2 short sentences describing the image in a neutral way.",
  "detected_mood": "one of: happy | calm | excited | serious | romantic | funny | unknown",
  "captions": [
    {
      "text": "caption text",
      "style": "one of: curiosity | emotional | humorous | premium | faith | storytelling | direct",
      "cta": "one of: comment | like | save | share | follow | click | none",
      "reason": "short reason why this caption fits the Goal + Platform"
    }
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "why_it_works": ["bullet 1", "bullet 2", "bullet 3"],
  "content_warnings": []
}

CAPTION GENERATION RULES
- Generate exactly 10 captions in the "captions" array.
- Captions must be meaningfully different (no small rewording).
- Match CaptionLength:
  - short: 3–8 words
  - medium: 8–18 words
  - long: 18–35 words (max 2 sentences)
- Match EmojiLevel:
  - none: 0 emojis
  - low: 0–1 emoji
  - normal: 1–2 emojis
  - high: 2–4 emojis
- Hashtags: generate 15 hashtags suitable for the image + platform + goal.
  - Instagram/TikTok: mix broad + niche tags
  - LinkedIn: minimal hashtags (max 5) and more professional
  - WhatsApp: hashtags can be empty or max 3 if unnatural

QUALITY CHECK BEFORE OUTPUT
- Ensure captions match the selected Platform tone.
- Ensure each caption supports the selected Goal.
- Ensure JSON is valid (double quotes, commas, brackets).
- Ensure arrays have correct counts.

Now analyze the image and produce the JSON.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: contentType,
        },
      },

    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const jsonResponse = JSON.parse(cleanText);
      return NextResponse.json(jsonResponse);
    } catch {
      console.error("Failed to parse JSON", text);
      return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error generating captions:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
