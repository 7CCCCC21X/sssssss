const { getAddress } = require("ethers/lib/utils");

module.exports = async function handler(req, res) {
  let { address, start, end } = req.query;

  // **转换地址为 EIP-55 校验格式**
  try {
    address = getAddress(address); 
  } catch (e) {
    console.error("无效的钱包地址:", e);
    return res.status(400).json({ error: "Invalid address" });
  }

  const apiUrl = `https://tx-api.untitledbank.co/user-txs?address=${address}&start=${start}&end=${end}`;

  console.log(`代理请求目标 API: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`目标 API 返回错误状态 ${response.status}: ${response.statusText}`);
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    
    // **添加 CORS 和防止缓存**
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('代理接口请求出错：', error);
    res.status(500).json({ error: error.message });
  }
};
