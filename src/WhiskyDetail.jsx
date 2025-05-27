import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const WhiskyDetail = ({ whisky, onBack }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!whisky) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL}/whiskies`);
        const filtered = res.data.filter(w => w.name === whisky.name);
        const sorted = filtered.sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
        setHistory(sorted);
      } catch (e) {
        console.error('가격 히스토리 조회 오류:', e);
      }
    };
    fetchData();
  }, [whisky]);

  if (!whisky) return null;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={onBack}>← 목록으로</button>
      <h2>{whisky.name}</h2>
      <p><strong>연도:</strong> {whisky.year}년산</p>
      <p><strong>가격:</strong> {whisky.purchase_price.toLocaleString()}원</p>
      <p><strong>구매일:</strong> {whisky.purchase_date}</p>
      <p><strong>보관 장소:</strong> {whisky.storage_location}</p>
      {whisky.image_url && (
        <div>
          <img src={whisky.image_url} alt={whisky.name} width="200" />
        </div>
      )}
      <br />
      <h3>📈 가격 히스토리</h3>
      {history.length > 1 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="purchase_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="purchase_price" stroke="#8884d8" name="가격" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>가격 히스토리 데이터가 부족합니다.</p>
      )}
    </div>
  );
};

export default WhiskyDetail;