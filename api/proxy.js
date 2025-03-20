async function fetchUntitledStatus(wallet) {
    try {
        const url = `https://your-project.vercel.app/api/proxy?address=${wallet}&start=4085424&end=5165422`;
        const response = await fetch(url);
        const data = await response.json();
        const txCount = data.length ?? 0;
        return txCount >= 10 ? "✅ 有" : `❌ 无 (${txCount})`;
    } catch (error) {
        console.error(`Untitled 查询失败: ${wallet}`, error);
        return "❌ 无";
    }
}
