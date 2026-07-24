"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Check,
  Clipboard,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { useCustomerSupportAI } from "@/hooks/ai/useAI";
import { CustomerSupportRequest } from "@/types/ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function SupportAIPage() {
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    ChatMessage[]
  >([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI support assistant. Enter a customer question or support issue, and I'll help you generate a helpful response.",
    },
  ]);

  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    mutate: askSupportAI,
    isPending,
    isError,
    error,
    reset,
  } = useCustomerSupportAI();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isPending]);

const handleSubmit = () => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || isPending) return;

  const userMessage: ChatMessage = {
    role: "user",
    content: trimmedMessage,
  };

  const updatedHistory = [
    ...conversationHistory,
    userMessage,
  ];

  setMessages((currentMessages) => [
    ...currentMessages,
    userMessage,
  ]);

  setMessage("");
  reset();

  askSupportAI(
    {
      message: trimmedMessage,
      conversationHistory: updatedHistory,
      ...(orderId.trim() && {
        orderId: orderId.trim(),
      }),
    },
    {
      onSuccess: (data) => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
        };

        setMessages((currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]);

        setConversationHistory([
          ...updatedHistory,
          assistantMessage,
        ]);
      },
    },
  );
};

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = async (
    content: string,
    index: number,
  ) => {
    await navigator.clipboard.writeText(content);

    setCopiedMessage(index);

    setTimeout(() => {
      setCopiedMessage(null);
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI support assistant. Enter a customer question or support issue, and I'll help you generate a helpful response.",
      },
    ]);

    setConversationHistory([]);
    setMessage("");
    setOrderId("");
    reset();
  };

  return (
    <main className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <Link
          href="/admin/ai"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Tools
        </Link>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-2xl">
              Support AI
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Use AI to improve and simplify customer support by generating
              helpful responses to customer questions and issues.
            </p>
          </div>
        </div>
      </section>

      {/* Main Chat Layout */}
      <section className="grid min-h-162.5 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Chat */}
        <div className="flex min-h-162.5 flex-col overflow-hidden rounded-2xl border border-border bg-card">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  AI Support Assistant
                </h2>

                <p className="text-xs text-muted-foreground">
                  Generate customer support responses
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden sm:inline">
                Clear
              </span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {messages.map((chatMessage, index) => {
              const isUser =
                chatMessage.role === "user";

              return (
                <div
                  key={`${chatMessage.role}-${index}`}
                  className={`flex gap-3 ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`group max-w-[90%] sm:max-w-[75%] ${
                      isUser
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border bg-muted/40 text-foreground"
                      }`}
                    >
                      {chatMessage.content}
                    </div>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            chatMessage.content,
                            index,
                          )
                        }
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        {copiedMessage === index ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-3.5 w-3.5" />
                            Copy response
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isPending && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-muted/40 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />

                  <span className="text-sm text-muted-foreground">
                    AI is preparing a response...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {isError && (
            <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:mx-6">
              <X className="h-4 w-4 shrink-0" />

              {error instanceof Error
                ? error.message
                : "Failed to generate support response."}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4 sm:p-5">
            <div className="flex items-end gap-3">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter a customer question or support issue..."
                rows={3}
                disabled={isPending}
                className="min-h-20 flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isPending ||
                  !message.trim()
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to send. Use Shift + Enter for a new line.
            </p>
          </div>
        </div>

        {/* Context Sidebar */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Support Context
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Add an order ID to give the AI additional order context.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="order-id"
              className="text-sm font-medium text-foreground"
            >
              Order ID
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (Optional)
              </span>
            </label>

            <input
              id="order-id"
              type="text"
              value={orderId}
              onChange={(event) =>
                setOrderId(event.target.value)
              }
              placeholder="Enter order ID"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">
              How it works
            </p>

            <div className="mt-3 space-y-3">
              <ContextStep
                number="1"
                text="Enter the customer's question or issue."
              />

              <ContextStep
                number="2"
                text="Optionally provide an order ID."
              />

              <ContextStep
                number="3"
                text="AI analyzes the request and context."
              />

              <ContextStep
                number="4"
                text="Copy the generated response to the customer."
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ContextStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {number}
      </span>

      <p className="text-sm leading-5 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}