import React, { useState } from "react";

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.finalUrl);
      }
    } catch (err) {
      setError("Network error.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Redirect Resolver</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Paste a link (e.g. https://click.convertkit-mail2.com/...)"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          style={{ width: "80%" }}
          required
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "Resolving..." : "Check Redirect"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 20 }}>
          <b>Final URL:</b> <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginTop: 20 }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default App;
