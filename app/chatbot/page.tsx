import { ChatInterface } from "@/components/ChatInterface";

export default function ChatBotPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold">Bhidu</h1>
          <p className="text-lg text-muted-foreground">
            This is a chatbot that can help you with your pet care needs.
          </p>
        </div>
        <div className="w-full max-w-2xl">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}