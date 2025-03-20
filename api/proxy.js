// api/proxy.js
export default async function handler(req, res) {
  const { address, start, end } = req.query;
  // 构造目标 API URL
  const apiUrl = `https://tx-api.untitledbank.co/user-txs?address=${address}&start=${start}&end=${end}`;
  console.log(`请求目标 API: ${apiUrl}`);

  try {
    // 尝试添加更多常见请求头
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    // 检查目标 API 的返回状态
    if (!response.ok) {
      console.error(`目标 API 返回错误状态 ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    // 添加 CORS 允许访问的头信息
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('代理接口请求出错：', error);
    res.status(500).json({ error: error.message });
  }
}
