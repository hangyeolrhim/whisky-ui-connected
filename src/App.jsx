import React, { useEffect, useState } from "react";
import WhiskyChart from "./components/WhiskyChart";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function App() {
  const [whisky, setWhisky] = useState("macallan 18");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    year: "",
    purchase_price: "",
    purchase_date: "",
    storage_location: "",
    image_file: null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/whiskies`);
      const all = await response.json();
      const match = all.find(w =>
        w.name.toLowerCase().includes(whisky.toLowerCase())
      );
      if (match) {
        const history = {
          "2024-05-01": {
            prices: [{ source: "user", price: match.purchase_price }],
          },import React, { useEffect, useState } from "react";
import WhiskyChart from "./components/WhiskyChart";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function App() {
  const [whisky, setWhisky] = useState("macallan 18");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/whiskies`);
      const all = await response.json();

      const match = all.find(w =>
        w.name.toLowerCase().includes(whisky.toLowerCase())
      );

      if (match) {
        const history = {
          "2024-05-01": {
            prices: [{ source: "user", price: match.purchase_price }]
          }
        };
        setData({ history });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("API 호출 오류:", err);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [whisky]);

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>📈 위스키 시세 추적</h1>
      <input
        value={whisky}
        onChange={(e) => setWhisky(e.target.value)}
        placeholder="예: macallan 18"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      {loading && <p>불러오는 중...</p>}
      {!loading && data && <WhiskyChart history={data.history} />}
      {!loading && !data && <p>데이터가 없습니다.</p>}
    </div>
  );
}

        };
        setData({ history });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("API 호출 오류:", err);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [whisky]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_file") {
      setForm({ ...form, image_file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (form.image_file) {
      const formData = new FormData();
      formData.append("file", form.image_file);
      const res = await fetch(`${API_BASE}/upload-photo`, {
        method: "POST",
        body: formData,
      });
      const uploadResult = await res.json();
      imageUrl = `${API_BASE}/photos/${uploadResult.filename}`;
    }

    const whiskyData = {
      user_id: "admin",
      name: form.name,
      year: parseInt(form.year),
      purchase_price: parseInt(form.purchase_price),
      purchase_date: form.purchase_date,
      storage_location: form.storage_location,
      image_url: imageUrl,
    };

    await fetch(`${API_BASE}/whiskies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(whiskyData),
    });

    alert("등록 완료! 검색창에서 확인해보세요.");
    setForm({ name: "", year: "", purchase_price: "", purchase_date: "", storage_location: "", image_file: null });
    fetchData();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>📈 위스키 시세 추적</h1>

      {/* 등록 폼 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h3>📝 위스키 등록</h3>
        <input name="name" placeholder="이름" value={form.name} onChange={handleInputChange} required /> <br />
        <input name="year" placeholder="연도" value={form.year} onChange={handleInputChange} required /> <br />
        <input name="purchase_price" placeholder="구매가" value={form.purchase_price} onChange={handleInputChange} required /> <br />
        <input name="purchase_date" type="date" value={form.purchase_date} onChange={handleInputChange} required /> <br />
        <input name="storage_location" placeholder="보관 위치" value={form.storage_location} onChange={handleInputChange} required /> <br />
        <input name="image_file" type="file" accept="image/*" onChange={handleInputChange} /> <br />
        <button type="submit">등록하기</button>
      </form>

      {/* 검색 */}
      <input
        value={whisky}
        onChange={(e) => setWhisky(e.target.value)}
        placeholder="예: macallan 18"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      {loading && <p>불러오는 중...</p>}
      {!loading && data && <WhiskyChart history={data.history} />}
      {!loading && !data && <p>데이터가 없습니다.</p>}
    </div>
  );
}
