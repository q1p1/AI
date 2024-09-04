import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatLog([...chatLog, `You: ${message}`]);
      setLoading(true);
      setMessage(""); // إعادة تعيين الرسالة بعد إرسالها

      try {
        // إرسال الطلب إلى Cohere API باستخدام Axios
        const response = await axios.post(
          "https://api.cohere.ai/generate",
          {
            model: "command-xlarge-nightly", // استخدام النموذج المتاح
            prompt: message, // النص الذي سيتم إرساله إلى API
            max_tokens: 150, // الحد الأقصى من الكلمات التي سيتم توليدها
          },
          {
            headers: {
              Authorization: `Bearer yzNINv8C8zeSYSD2JoPmdR96voVQBmWSDUZXKxdH`, // ضع مفتاح API الخاص بك هنا
              "Content-Type": "application/json",
            },
          }
        );

        // طباعة الرد الكامل للتأكد من شكل البيانات
        console.log("Cohere API Response:", response.data);

        // التحقق مما إذا كانت البيانات المستلمة تحتوي على "generations"
        if (
          response.data &&
          response.data.generations &&
          response.data.generations.length > 0
        ) {
          const botMessage = response.data.generations[0].text.trim();
          setChatLog((prevLog) => [...prevLog, `Bot: ${botMessage}`]);
        } else {
          setChatLog((prevLog) => [
            ...prevLog,
            "Bot: Sorry, no response from the AI.",
          ]);
        }
      } catch (error) {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">AI Chatbot</h1>
        <div className="border border-gray-300 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          {chatLog.map((msg, index) => (
            <p key={index} className="mb-2">
              {msg}
            </p>
          ))}
          {loading && <p className="text-gray-500">Bot is typing...</p>}
        </div>
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
