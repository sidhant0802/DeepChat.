import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const chat = {
  model: "openai/gpt-3.5-turbo",
  history: [
    {
      role: "system",
      content: `You are DeepChat, a friendly, helpful, and professional AI assistant.
Keep responses concise and clear.
When listing multiple options or steps, use a short bullet list.`
    }
  ]
};

export async function sendMessage(userMessage) {

  chat.history.push({
    role: "user",
    content: userMessage
  });

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: chat.model,
        messages: chat.history
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "DeepChat"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    chat.history.push({
      role: "assistant",
      content: reply
    });

    return reply;

  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    throw new Error("AI service error");
  }
}