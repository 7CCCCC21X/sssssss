// api/proxy.js
export default async function handler(req, res) {
  const { address, start, end } = req.query;
  // 构造正确的目标接口 URL
  const apiUrl = `https://tx-api.untitledbank.co/user-txs?address=${address}&start=${start}&end=${end}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // 添加 CORS 允许访问的头信息
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('代理接口请求出错：', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
