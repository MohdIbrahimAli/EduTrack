import { ChatInterface } from "@/components/messages/chat-interface";
import { MOCK_CONVERSATIONS } from "@/lib/placeholder-data";

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-0 md:py-8 h-full md:h-auto"> {/* Adjusted padding for potentially full height */}
      {/* <h1 className="text-3xl font-bold mb-8 text-primary">Messages</h1> */} {/* Title can be in AppHeader */}
      <ChatInterface initialConversations={MOCK_CONVERSATIONS} />
    </div>
  );
}
