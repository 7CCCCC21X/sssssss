export default async function handler(req, res) {
  const apiUrl = "https://storage.googleapis.com/untitledbank-badge/wallet_transactions_latest.json";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "API 请求失败" });
  }
}
