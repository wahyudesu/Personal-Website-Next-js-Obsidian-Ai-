"use client";

import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import Image from "next/image";
import { useState, useEffect, FormEvent, useRef } from "react";
import { motion } from "framer-motion";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const initialMessage: Message = {
      id: "0",
      sender: "bot",
      text: "Tanyakan padaku sesuatu!",
    };
    setMessages([initialMessage]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const sendMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, sendMessage]);
    setInput("");
    setIsLoading(true);

    scrollToBottom();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sendMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: `${Date.now()}1`,
          sender: "bot",
          text: data.response,
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: `${Date.now()}2`,
          sender: "bot",
          text: data.error,
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      const errorMessage: Message = {
        id: `${Date.now()}3`,
        sender: "bot",
        text: "An unexpected error occurred",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-800 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">Ask anything</h1>
      </div>
      <div className="mb-4 flex items-center">
        <p className="flex-1">
          Kamu bisa menanyakan apa saja soal diriku, mulai dari educational background, experiences, and skills, hingga hobi.
          <div className="relative group inline-block">
            <button
              type="button"
              className="ml-2"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Show information</span>
            </button>
            <div
              id="popover-description"
              className="absolute z-10 hidden group-hover:block opacity-100 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 p-3 space-y-2 text-sm text-gray-500 dark:bg-black dark:border-gray-600 dark:text-gray-400"
              role="tooltip"
            >
              <div className="font-semibold text-gray-900 dark:text-white">RAG Chatbot</div>
              <p>
                Model menggunakan llama 70b yang dilatih dengan data pribadi saya seperti resume dan kepribadian saya sehingga mampu menjawab pertanyaan yang sesuai dengan data yang saya miliki.
              </p>
            </div>
          </div>
        </p>
      </div>

      {/* Area Chat dengan Scroll */}
      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-md h-auto min-h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`mb-4 flex ${
              msg.sender === "user" ? "justify-end text-right" : "justify-start text-left"
            }`}
          >
            {msg.sender === "bot" ? (
              <div className="flex items-start gap-2.5">
                <Image
                  src="/icons/avatar.jpg"
                  alt="Bot image"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-500 dark:text-white">
                      Wahyu
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex flex-col bg-primary-500 leading-1.5 p-3 border-gray-200 rounded-e-xl rounded-es-xl">
                    <p className="text-sm font-normal text-white">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="bg-black/20 px-4 py-2 dark:bg-white/60 flex flex-col leading-1.5 text-black/80 rounded-s-xl rounded-se-xl">
                  <p className="text-sm font-normal">{msg.text}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 flex flex-col sm:flex-row gap-2"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-primary-500 border-opacity-0 hover:border-opacity-100 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 w-full text-black dark:text-white"
          placeholder="Adakah yang ingin ditanyakan?"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={`bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 dark:text-white ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </motion.form>
    </div>
  );
}