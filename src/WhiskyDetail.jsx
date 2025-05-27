
import React from 'react';

const WhiskyDetail = ({ whisky, onBack }) => {
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
    </div>
  );
};

export default WhiskyDetail;
