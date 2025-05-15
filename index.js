// 모듈 불러오기 및 설정하기
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
require('dotenv').config();

// 분리된 기능 모듈 가져오기
const uploadFile = require('./modules/uploadFile');
const pollReport = require('./modules/pollReport');
const sendTeamsAdaptiveCard = require('./modules/sendTeamsCard');
const saveToExcel = require('./modules/saveToExcel');

// 기본 경로 및 파일 이름 설정하기
const UPLOAD_DIR = './upload';
const RESULT_DIR = './Analyses_Result';
const now = dayjs().format('YYYYMMDDHHmm');
const outputExcel = path.join(RESULT_DIR, `${now}_API_auto_result.xlsx`);

async function run() {
  // 결과 저장 폴더가 없으면 생성하기
  if (!fs.existsSync(RESULT_DIR)) {
    fs.mkdirSync(RESULT_DIR);
    console.log(`📁 결과 폴더 생성: ${RESULT_DIR}`);
  }
  // 업로드 대상 파일 목록 불러오기
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .filter(f => fs.statSync(path.join(UPLOAD_DIR, f)).isFile());
  // 업로드할 파일이 없을 경우 종료하기
  if (files.length === 0) {
    console.log('❗ 분석할 파일이 없습니다. ./upload 폴더를 확인해주세요.');
    return;
  }

  const results = [];
  // 각 파일 업로드 → 리포트 polling → 결과 저장하기
  for (const [i, file] of files.entries()) {
    console.log(`🚀 [${i + 1}/${files.length}] 분석 시작: ${file}`);
    const filePath = path.join(UPLOAD_DIR, file);
    const txId = await uploadFile(filePath, file);

    if (!txId) {
      results.push({ filename: file, result: 'upload_failed', txid: null });
      continue;
    }

    console.log(`⏳ 분석 대기 중... (txId: ${txId})`);
    const result = await pollReport(txId, 60, 3000);
    results.push({ filename: file, result, txid: txId });
  }
  // 결과 Excel 저장 및 Teams 전송
  await saveToExcel(results, outputExcel);
  await sendTeamsAdaptiveCard(results);

  console.log(`✅ 작업 완료. 결과 파일: ${outputExcel}`);
}

run();
