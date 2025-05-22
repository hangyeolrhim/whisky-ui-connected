import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [query, setQuery] = useState("");
  const [whiskies, setWhiskies] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [selectedWhisky, setSelectedWhisky] = useState(null);

  const fetchWhiskies = async () => {
    const res = await axios.get(`${API_BASE}/whiskies`);
    setWhiskies(res.data);
  };

  const handleRegister = async () => {
    if (!query.trim()) return alert("위스키명을 입력해주세요.");
    const confirm = window.confirm(`${query} 가격을 등록하시겠습니까?`);
    if (!confirm) return;

    const body = {
      user_id: "admin",
      name: query,
      year: 2024,
      purchase_price: 450000,
      purchase_date: new Date().toISOString().slice(0, 10),
      storage_location: "vault",
      image_url: uploadedUrl,
    };

    await axios.post(`${API_BASE}/whiskies`, body);
    setQuery("");
    fetchWhiskies();
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    const res = await axios.post(`${API_BASE}/upload-photo`, formData);
    setUploadedUrl(`${API_BASE}/photos/${res.data.filename}`);
  };

  useEffect(() => {
    fetchWhiskies();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 위스키 시세 추적</h1>

      <input
        placeholder="macallan 18"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleRegister}>+ 시세 등록</button>

      <hr />

      <h2>📷 이미지 업로드</h2>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={handleImageUpload}>업로드</button>
      {uploadedUrl && (
        <>
          <p>업로드 성공:</p>
          <img src={uploadedUrl} alt="preview" width={150} />
        </>
      )}

      <hr />

      <h2>📋 위스키 목록</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {whiskies.map((w) => (
          <div
            key={w.id}
            onClick={() => setSelectedWhisky(w)}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 10,
              width: 200,
              cursor: "pointer",
            }}
          >
            {w.image_url && (
              <img
                src={w.image_url}
                alt={w.name}
                style={{ width: "100%", height: 120, objectFit: "cover" }}
              />
            )}
            <h4>{w.name}</h4>
            <p>{w.year}년산</p>
            <p>{w.purchase_price.toLocaleString()}원</p>
          </div>
        ))}
      </div>

      {selectedWhisky && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ background: "white", padding: 20, borderRadius: 10, width: 400 }}>
            <h3>{selectedWhisky.name}</h3>
            {selectedWhisky.image_url && (
              <img src={selectedWhisky.image_url} alt="whisky" style={{ width: "100%", borderRadius: 5 }} />
            )}
            <p><strong>연도:</strong> {selectedWhisky.year}</p>
            <p><strong>가격:</strong> {selectedWhisky.purchase_price.toLocaleString()}원</p>
            <p><strong>구입일:</strong> {selectedWhisky.purchase_date}</p>
            <p><strong>보관 위치:</strong> {selectedWhisky.storage_location}</p>
            <button onClick={() => setSelectedWhisky(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
