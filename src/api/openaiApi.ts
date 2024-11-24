import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type {OpenaiData} from "./types";

// Initialize the OpenAI client

// Define the JSON schema using Zod
const OmuIndexSchema = z.object({
  shoutengai: z.object({
    index: z.number(), // Zodのint型に変更し、整数のみ許可
    text: z.string(),
  }),
  michi: z.object({
    index: z.number(), // Zodのint型に変更
    text: z.string(),
  }),
  furuiMise: z.object({
    index: z.number(), // Zodのint型に変更
    text: z.string(),
  }),
  shokuSample: z.object({
    index: z.number(), // Zodのint型に変更
    text: z.string(),
  }),
  building: z.object({
    index: z.number(), // Zodのint型に変更
    text: z.string(),
  }),
  chain: z.object({
    index: z.number(), // Zodのint型に変更
    text: z.string(),
  }),
});

// Function to calculate the Omu Index
export async function calculateOmuIndex(apiKey:string, stationName: string): Promise<OpenaiData|null> {
  const prompt = `
    あなたは日本の町の懐かしさを評価する専門家です。駅名「${stationName}」に基づいて、以下の4つの要素を0から10のスケールで評価し、それぞれの理由を述べてください：
    - 古い商店街の存在感 (shoutengai)
    - 道が入り組んでいる度合い (michi)
    - 飲食店に限らず古い店が生き残っている度合い (furui_mise)
    - 古いショーケースや食品サンプルが飾ってある店の存在感 (shoku_sample)
    - 古い飲食ビルの存在感 (building)
    - 全国に多店舗展開している店が少ない (chain)

    根拠は簡潔に、120字以内にまとめてください。

    結果を次の形式のJSONオブジェクトとして返してください：
    {
      "shoutengai":  { "index": 得点, "text": "根拠" },
      "michi":  { "index": 得点, "text": "根拠" },
      "furuiMise": { "index": 得点, "text": "根拠" },
      "shokuSample": { "index": 得点, "text": "根拠" },
      "building": { "index": 得点, "text": "根拠" },
      "chain": { "index": 得点, "text": "根拠" },
    }`;

  try {
    return null;
    console.log("openai call");
    // Make a request to the OpenAI API
    
    /*
    const openai = new OpenAI({
      apiKey,
    });
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "次のJSONスキーマに従って出力を生成してください。" },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(OmuIndexSchema, "omuIndex"),
    });
    // Get the parsed and validated response
    const omuIndex = completion.choices[0].message.parsed;
    return omuIndex;
    */
  } catch (error) {
    console.error("Error generating Omu Index:", error);
    return null;
  }
};
