export default async function handler(req, res) {
  const apiUrl = "https://storage.googleapis.com/untitledbank-badge/wallet_transactions_latest.json";

  // 允许跨域访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理 `OPTIONS` 预检请求（CORS）
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "API 请求失败" });
  }
}
