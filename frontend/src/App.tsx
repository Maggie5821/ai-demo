import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question) return;
    const userMsg = { role: "user", content: question };
    setChat([...chat, userMsg]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "assistant", content: "请求失败" }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>AI 问答 Demo</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{msg.role === "user" ? "你" : "AI"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>AI 正在思考...</div>}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入问题"
          style={{ width: "70%", padding: 5 }}
        />
        <button
          onClick={handleSubmit}
          style={{ padding: "5px 10px", marginLeft: 5 }}
        >
          发送
        </button>
      </div>
    </div>
  );
}
