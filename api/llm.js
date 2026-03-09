import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(userMessage) {

  const messages = [
    {
      role: "system",
      content: `You are DeepChat, a friendly, helpful AI assistant.
Keep responses concise and clear. Use bullet points when helpful.`
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL,
          "X-Title": "DeepChat"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {

    console.error("OpenRouter error:", err.response?.data || err.message);
    throw new Error("AI service error");

  }
}