export async function fetchWhiskyHistory(whiskyName) {
  const baseUrl = process.env.REACT_APP_API_URL;
  const response = await fetch(`${baseUrl}/history/${encodeURIComponent(whiskyName)}`);
  if (!response.ok) throw new Error("API 호출 실패");
  return await response.json();
}
