import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WhiskyDetail = ({ whisky, allWhiskies, onBack }) => {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    if (!whisky) return;
    const filtered = allWhiskies
      .filter(w => w.name.toLowerCase() === whisky.name.toLowerCase())
      .map(w => ({
        date: w.purchase_date,
        price: w.purchase_price,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setPriceHistory(filtered);
  }, [whisky, allWhiskies]);

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
        <div style={{ marginTop: '10px' }}>
          <img src={whisky.image_url} alt={whisky.name} width="200" />
        </div>
      )}

      <h3 style={{ marginTop: '40px' }}>📈 가격 히스토리</h3>
      {priceHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={priceHistory}>
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 10000', 'dataMax + 10000']} />
            <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={true} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>가격 히스토리 데이터가 부족합니다.</p>
      )}
    </div>
  );
};

export default WhiskyDetail;