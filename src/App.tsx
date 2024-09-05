import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatLog([...chatLog, `You: ${message}`]);
      setLoading(true);
      setMessage(""); // Reset the message after sending it
      setError(null); // Reset error status

      try {
        const response = await axios.post(
          "https://api.cohere.ai/generate",
          {
            model: "command-xlarge",
            prompt: message,
            max_tokens: 400,
            api_version: "2021-11-08",
          },
          {
            headers: {
              Authorization: `Bearer yzNINv8C8zeSYSD2JoPmdR96voVQBmWSDUZXKxdH`, // API
              "Content-Type": "application/json",
            },
          }
        );

        // Print the full response to check the format of the data
        console.log("Cohere API Response:", response.data);

        // Extract text from the response
        if (response.data && response.data.text) {
          const botMessage = response.data.text.trim();
          setChatLog((prevLog) => [...prevLog, `Bot: ${botMessage}`]);
        } else {
          setChatLog((prevLog) => [
            ...prevLog,
            "Bot: Sorry, no response from the AI.",
          ]);
        }
      } catch (error) {
        setError("Failed to fetch response from the AI. Please try again.");
        setChatLog((prevLog) => [
          ...prevLog,
          "Bot: Sorry, something went wrong.",
        ]);
        console.error("Error calling Cohere API:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-600 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">AI Chatbot</h1>

        <div className="border border-gray-300 rounded-lg p-4 mb-4 h-64 overflow-y-auto bg-gray-50">
          {chatLog.map((msg, index) => (
            <p
              key={index}
              className={`mb-2 ${
                msg.startsWith("You") ? "text-blue-500" : "text-green-500"
              }`}
            >
              {msg}
            </p>
          ))}
          {loading && <p className="text-gray-500">Bot is typing...</p>}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
