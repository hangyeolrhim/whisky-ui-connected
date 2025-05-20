import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const App = () => {
  const [query, setQuery] = useState('');
  const [whiskies, setWhiskies] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/whiskies`);
      setWhiskies(res.data);
    } catch (error) {
      console.error('API 호출 실패:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = whiskies.filter(w =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );

  const chartData = filtered.map(w => ({
    name: w.name,
    date: w.purchase_date,
    price: w.purchase_price,
    user: w.user_id
  }));

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>📈 위스키 시세 추적</h1>
      <input
        type="text"
        placeholder="macallan 18"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: 10, width: '100%', marginBottom: 30 }}
      />

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 10000', 'dataMax + 10000']} tickFormatter={v => v.toLocaleString()} />
            <Tooltip formatter={value => value.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" name="user" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default App;
