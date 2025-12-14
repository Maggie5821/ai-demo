import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 在 Vercel/本地环境变量里设置
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const { prompt } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "AI 请求失败" });
  }
}
