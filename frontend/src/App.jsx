import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState(
    "https://aac9bb441693.ngrok-free.app"
  ); // Default ngrok URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("⚠️ Please upload a file.");
    if (!backendUrl) return alert("⚠️ Please enter backend URL.");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post(`${backendUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.text) {
        setResult(res.data.text);
      } else {
        alert("❌ OCR failed. No text extracted.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsTxt = () => {
    const blob = new Blob([result], { type: "text/plain" });
    triggerDownload(blob, "ocr-output.txt");
  };

  const downloadAsHtml = () => {
    const html = `<html><body><pre>${result}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    triggerDownload(blob, "ocr-output.html");
  };

  const downloadAsDoc = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head><body>`;
    const footer = "</body></html>";
    const content = header + `<pre>${result}</pre>` + footer;
    const blob = new Blob(["\ufeff", content], {
      type: "application/msword",
    });
    triggerDownload(blob, "ocr-output.doc");
  };

  const triggerDownload = (blob, filename) => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="wrapper">
      <h1 className="title">📄 NITIOCR — AI OCR Tool</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          className="url-input"
          placeholder="🔗 Enter backend URL here"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
        />

        <label className="upload-box">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          {file ? file.name : "📁 Click to upload file"}
        </label>

        <button type="submit" className="btn">
          {loading ? "⏳ Processing..." : "🔍 Extract Text"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <h2>✅ Extracted Text:</h2>
          <textarea readOnly value={result}></textarea>
          <div className="download-buttons">
            <button onClick={downloadAsTxt} className="btn">
              ⬇️ TXT
            </button>
            <button onClick={downloadAsHtml} className="btn">
              ⬇️ HTML
            </button>
            <button onClick={downloadAsDoc} className="btn">
              ⬇️ DOC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
