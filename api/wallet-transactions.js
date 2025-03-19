export default async function handler(req, res) {
  const apiUrl = "https://storage.googleapis.com/untitledbank-badge/wallet_transactions_latest.json";

  // 允许跨域访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // 允许携带 Cookie

  // 处理 `OPTIONS` 预检请求（CORS）
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors", // 避免 Vercel 拦截
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("请求失败:", error);
    res.status(500).json({ error: "API 请求失败" });
  }
}
