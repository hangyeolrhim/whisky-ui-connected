import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WhiskyDetail from './WhiskyDetail';

const App = () => {
  const [query, setQuery] = useState('');
  const [whiskies, setWhiskies] = useState([]);
  const [image, setImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [selectedWhisky, setSelectedWhisky] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (query.trim() === '') {
      setWhiskies([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/whiskies?name=${query}`);
        setWhiskies(res.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [query, API_BASE_URL]);

  const handleImageUpload = async () => {
    if (!image) return alert('이미지를 선택하세요');
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      setUploadedUrl(res.data.url);
      console.log("업로드된 이미지 URL:", res.data.url);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
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

    try {
      await axios.post(`${API_BASE_URL}/whiskies`, body);
      alert('시세 등록 완료');
      setQuery('');
      setImage(null);
      setUploadedUrl('');
    } catch (err) {
      console.error("시세 등록 실패:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📈 위스키 시세 추적</h1>

      {selectedWhisky ? (
        <WhiskyDetail whisky={selectedWhisky} allWhiskies={whiskies} onBack={() => setSelectedWhisky(null)} />
      ) : (
        <>
          <div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="macallan 18"
              style={{ marginRight: 8 }}
            />
            <button onClick={handleRegister}>+ 시세 등록</button>
          </div>

          <hr />
          <h2>📸 이미지 업로드</h2>
          <input type="file" onChange={e => setImage(e.target.files[0])} />
          <button onClick={handleImageUpload}>업로드</button>
          {uploadedUrl && (
            <div>
              <p>업로드 성공:</p>
              <img src={uploadedUrl} alt="preview" width="150" />
            </div>
          )}

          <hr />
          <h2>📋 위스키 목록</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {whiskies.map(w => (
              <div
                key={w.id}
                onClick={() => setSelectedWhisky(w)}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  padding: 10,
                  width: 200,
                  cursor: 'pointer'
                }}
              >
                <img
                  src={w.image_url}
                  alt={w.name}
                  width="100%"
                  style={{ borderRadius: 4 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default_whisky.png";
                  }}
                />
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
};

export default App;