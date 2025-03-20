export default async function handler(req, res) {
    // ✅ 允许所有来源访问（或者指定具体的前端域名）
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

    // ✅ 处理预检请求
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    const { address, start, end } = req.query;

    if (!address || !start || !end) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    const targetUrl = `https://tx-api.untitledbank.co/user-txs?address=${encodeURIComponent(address)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&t=${Date.now()}`;

    console.log(`🚀 正在请求 API: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
            timeout: 10000
        });

        if (!response.ok) {
            console.error(`⚠️ 目标 API 响应失败: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: "目标 API 响应失败", status: response.status });
        }

        const data = await response.json();
        console.log("✅ API 返回数据:", JSON.stringify(data, null, 2));

        return res.status(200).json(data);

    } catch (error) {
        console.error("🚨 API 请求失败:", error);
        return res.status(500).json({ error: "API 代理请求失败", message: error.message });
    }
}
