export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { address, start, end } = req.query;

    if (!address || !start || !end) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    const targetUrl = `https://tx-api.untitledbank.co/user-txs?address=${encodeURIComponent(address)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    try {
        console.log(`🚀 正在请求 API: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "application/json"
            },
            timeout: 10000
        });

        if (!response.ok) {
            console.error(`⚠️ 目标 API 响应失败: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: "目标 API 响应失败", status: response.status });
        }

        const data = await response.json();

        if (!data || typeof data.length !== "number") {
            console.error("❌ API 返回数据异常:", data);
            return res.status(500).json({ error: "API 返回数据异常", data });
        }

        console.log(`✅ 查询成功，交易次数: ${data.length}`);

        // 返回 `length` 字段
        return res.status(200).json({ transaction_count: data.length });

    } catch (error) {
        console.error("🚨 API 请求失败:", error);
        return res.status(500).json({ error: "API 代理请求失败", message: error.message });
    }
}
