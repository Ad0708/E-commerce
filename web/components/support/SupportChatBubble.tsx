"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCustomerSupportAI } from "@/hooks/ai/useAI";
import { useAuthStore } from "@/store/auth.store";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI support assistant. How can I help you today?",
};

function extractOrderId(text: string): string | undefined {
  return text.match(/(?:order|#)\s*([A-Z0-9-]{4,})/i)?.[1];
}

export default function SupportChatBubble() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutateAsync, isPending } = useCustomerSupportAI();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    const history = messages.filter((m) => m.id !== "welcome");

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);

    try {
      const result = await mutateAsync({
        message: text,
        conversationHistory: history,
        orderId: extractOrderId(text),
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result?.response ?? String(result),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }, [input, isPending, messages, mutateAsync]);

  if (!user) return null;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {open && (
        <div
          className="
            w-[calc(100vw-2.5rem)] max-w-sm
            sm:w-96
            h-[min(600px,calc(100dvh-5.5rem))]
            flex flex-col rounded-2xl shadow-2xl border
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-700
            overflow-hidden
          "
          role="dialog"
          aria-label="AI Support Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5 text-blue-500" />
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                Support
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMessages([WELCOME])}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
              >
                <div
                  className={`
                    relative max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                    }
                  `}
                >
                  {msg.content}
                  {msg.role === "assistant" && msg.id !== "welcome" && (
                    <button
                      onClick={() => copyText(msg.id, msg.content)}
                      aria-label="Copy response"
                      className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedId === msg.id ? (
                        <Check className="size-3 text-green-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2.5">
                  <Loader2 className="size-4 text-slate-400 animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl">
                <AlertCircle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message… (Enter to send)"
                rows={1}
                aria-label="Message input"
                className="
                  flex-1 resize-none bg-transparent text-sm
                  text-slate-800 dark:text-slate-100
                  placeholder:text-slate-400
                  focus:outline-none max-h-32 overflow-y-auto
                "
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={send}
                disabled={!input.trim() || isPending}
                aria-label="Send message"
                className="shrink-0 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="
          size-14 rounded-full shadow-xl
          bg-blue-600 hover:bg-blue-700
          text-white flex items-center justify-center
          transition-all active:scale-95
        "
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
