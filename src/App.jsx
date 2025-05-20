import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const fetchData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/whiskies`);
    const filtered = res.data
      .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
      .map((w) => ({
        name: "user",
        date: w.purchase_date,
        price: w.purchase_price,
      }));
    setData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택해주세요.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/upload-photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setUploadedUrl(`${process.env.REACT_APP_API_BASE_URL}/photos/${res.data.filename}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📈 위스키 시세 추적</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Macallan 18"
        style={{ width: 500, height: 30, fontSize: 16 }}
      />

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 30, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 10000', 'dataMax + 10000']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" name="user" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>데이터가 없습니다.</p>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>📸 이미지 업로드</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
      {uploadedUrl && <div><p>업로드 성공:</p><img src={uploadedUrl} alt="preview" width={200} /></div>}
    </div>
  );
}

export default App;
