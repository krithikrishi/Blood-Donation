import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTypingMessage(""); // clear previous typing

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "HealthCare App",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that answers questions about blood donation and healthcare.",
            },
            ...newMessages,
          ],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const reply = data.choices?.[0]?.message?.content ?? "No response.";
        // Start typing the assistant's reply
        typeText(reply, newMessages);
      } else {
        console.error(data);
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, something went wrong. 💔" },
        ]);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. 💔" },
      ]);
      setLoading(false);
    }
  };

  const typeText = (text, messageHistory) => {
    let index = 0;
    setTypingMessage("");
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setMessages([...messageHistory, { role: "assistant", content: text }]);
        setTypingMessage("");
        setLoading(false);
      }
    }, 15); // typing speed (ms per character)
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[32rem] bg-white shadow-lg rounded-xl p-4 z-50 flex flex-col">
          <h3 className="font-semibold mb-2">AI Assistant</h3>

          <div className="flex-1 overflow-y-auto mb-2 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-red-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ))}

            {loading && typingMessage && (
              <div className="p-2 rounded bg-gray-100 text-left whitespace-pre-wrap text-gray-800">
                {typingMessage}
                <span className="animate-pulse text-gray-400">|</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
