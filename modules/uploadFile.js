// 파일 업로드 및 txId 반환 담당 모듈

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');

// 환경변수 로드
const BASE_URL = process.env.API_BASE_URL;
const TOKEN = process.env.BEARER_TOKEN;
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function uploadFile(filePath, fileName) {
  try {
    // FormData 구성: 파일을 multipart/form-data 형태로 첨부하기    
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const headers = {
      ...form.getHeaders(),
      Authorization: `Bearer ${TOKEN}`
    };
    // API 요청: 파일 업로드하기    
    const response = await axios.post(BASE_URL, form, {
      headers,
      httpsAgent
    });
    // txId 추출하기
    const txId = response.data?.data?.txId;
    if (!txId) throw new Error('txId 없음');
    console.log(`✅ 업로드 완료: ${fileName} → txId: ${txId}`);
    return txId;
  } catch (err) {
    // 오류 처리 및 디버깅 로그
    console.error(`❌ 업로드 실패: ${fileName} (${err.message})`);
    if (err.response) {
      console.error('[DEBUG] Axios Response Error:', {
        status: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers,
        data: err.response.data,
      });
    } else if (err.request) {
      console.error('[DEBUG] Axios No Response Error:', err.request);
    } else {
      console.error('[DEBUG] General Error:', err.message);
    }
    return null;
  }
}

module.exports = uploadFile;
