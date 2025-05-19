import React, { useEffect, useState } from "react";
import { fetchWhiskyHistory } from "./api/fetchWhisky";
import WhiskyChart from "./components/WhiskyChart";

export default function App() {
  const [whisky, setWhisky] = useState("macallan 18");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchWhiskyHistory(whisky);
      setData(result);
    } catch (error) {
      console.error("API 호출 오류:", error);
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
