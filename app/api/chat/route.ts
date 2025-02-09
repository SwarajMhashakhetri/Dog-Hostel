import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Client } from "langsmith";
import { LangChainTracer } from "langchain/callbacks";

const client = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY as string,
});

const tracer = () => new LangChainTracer({ client }); 

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
  modelName: "gemini-1.5-pro",
});

const systemPrompt = `You are an expert pet care assistant at a pet hostel. Help users with:
- Basic pet care
- Safe interaction with animals
- Pet health and wellness tips
- Emergency pet care recommendations

Do NOT provide medical advice; recommend a veterinarian for serious issues.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{question}"],
]);

const chain = RunnableSequence.from([prompt, model]).withConfig({
  runName: "pet-care-chatbot",
  tags: ["pet-assistant"],
  metadata: { service: "pet-care" },
  callbacks: [tracer()],
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const response = await chain.invoke({ question });

    return NextResponse.json({ response: response.content });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from bot" },
      { status: 500 }
    );
  }
}