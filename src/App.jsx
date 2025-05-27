import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WhiskyDetail from './WhiskyDetail';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [whiskies, setWhiskies] = useState([]);
  const [selectedWhisky, setSelectedWhisky] = useState(null);

  useEffect(() => {
    fetchWhiskies();
  }, []);

  const fetchWhiskies = async () => {
    const res = await axios.get(`${API_BASE}/whiskies`);
    setWhiskies(res.data);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await axios.post(`${API_BASE}/upload-photo`, formData);
    setUploadedUrl(`${API_BASE}/photos/${res.data.filename}`);
  };

  const handleRegister = async () => {
    if (!query.trim()) return alert('위스키명을 입력해 주세요.');
    const confirm = window.confirm(`${query} 가격을 등록하시겠습니까?`);
    if (!confirm) return;

    const body = {
      user_id: 'admin',
      name: query,
      year: 2024,
      purchase_price: 450000,
      purchase_date: new Date().toISOString().slice(0, 10),
      storage_location: 'vault',
      image_url: uploadedUrl,
    };
    await axios.post(`${API_BASE}/whiskies`, body);
    setQuery('');
    setImageFile(null);
    setUploadedUrl('');
    fetchWhiskies();
  };

  const cardStyle = {
    border: '1px solid #ccc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: 200,
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 위스키 시세 추적</h1>
      {selectedWhisky ? (
        <WhiskyDetail whisky={selectedWhisky} onBack={() => setSelectedWhisky(null)} />
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="macallan 18"
            />
            <button onClick={handleRegister}>+ 시세 등록</button>
          </div>

          <hr />
          <h2>📷 이미지 업로드</h2>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          <button onClick={handleUpload}>업로드</button>
          {uploadedUrl && (
            <div>
              <p>업로드 성공:</p>
              <img src={uploadedUrl} alt="whisky" width={100} />
            </div>
          )}

          <hr />
          <h2>📑 위스키 목록</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {whiskies.map((w) => (
              <div
                key={w.id}
                style={{ ...cardStyle, cursor: 'pointer' }}
                onClick={() => setSelectedWhisky(w)}
              >
                {w.image_url && (
                  <img
                    src={w.image_url}
                    alt={w.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                )}
                <h3>{w.name}</h3>
                <p>{w.year}년산</p>
                <p>{w.purchase_price.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;