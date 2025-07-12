import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file first.");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ocr-tool-llnh.onrender.com/ocr", // ← अपने backend URL से बदलें
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      alert("OCR failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "ocr-result.txt";
    element.click();
  };

  return (
    <div className="wrapper">
      <h1 className="title">📄 NITIOCR — AI OCR Tool</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="upload-box">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          {file ? file.name : "📁 Click to upload file"}
        </label>
        <button type="submit" className="btn">
          {loading ? "Processing..." : "Extract Text"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <h2>✅ Extracted Text:</h2>
          <textarea readOnly value={result}></textarea>
          <button onClick={handleDownload} className="btn">
            ⬇️ Download Result
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
