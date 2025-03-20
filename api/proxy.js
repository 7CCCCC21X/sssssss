export default async function handler(req, res) {
    // 允许跨域请求
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 处理 CORS 预检请求
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // 获取 API 参数
    const { address, start, end } = req.query;

    if (!address || !start || !end) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    // 目标 API URL
    const targetUrl = `https://tx-api.untitledbank.co/user-txs?address=${address}&start=${start}&end=${end}`;

    try {
        // 代理请求到目标 API
        const response = await fetch(targetUrl);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("API 请求失败:", error);
        return res.status(500).json({ error: "API 代理请求失败" });
    }
}
