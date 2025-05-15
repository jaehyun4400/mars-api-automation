// txId를 기반으로 분석 상태를 polling 하여 결과를 반환하는 모듈

const axios = require('axios');
const https = require('https');

const BASE_URL = process.env.API_BASE_URL;
const TOKEN = process.env.BEARER_TOKEN;
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function pollReport(txId, maxAttempts = 20, delayMS = 3000) {
  const REPORT_URL = `${BASE_URL}/${txId}/report`;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(res => setTimeout(res, delayMS));
    try {
      // 리포트 요청하기
      const res = await axios.get(REPORT_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
        httpsAgent
      });

      const report = res.data?.data?.[0];
      console.log(`[DEBUG] txId: ${txId} 응답 요약:`);
      console.log(JSON.stringify(res.data, null, 2));
      // 결과가 존재하면 리턴하기
      if (report?.Summary?.Result) {
        return report.Summary.Result;
      }
    } catch (err) {
      // 404가 아니면 에러 출력 후 중단
      if (err.response?.status !== 404) {
        console.log(`⚠️ 보고서 요청 중 오류: ${err.message}`);
        break;
      }
    }
  }

  return 'timeout';
}

module.exports = pollReport;
