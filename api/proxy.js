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
    const targetUrl = `https://tx-api.untitledbank.co/user-txs?address=${encodeURIComponent(address)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    try {
        // 代理请求到目标 API，增加 User-Agent 头
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        // 检查 API 响应状态
        if (!response.ok) {
            console.error("API 响应失败:", response.statusText);
            return res.status(response.status).json({ error: "目标 API 响应失败", status: response.status });
        }

        // 解析 JSON 数据
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("API 请求失败:", error);
        return res.status(500).json({ error: "API 代理请求失败" });
    }
}
