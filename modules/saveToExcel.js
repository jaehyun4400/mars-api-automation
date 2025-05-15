// 분석 결과를 Excel 파일로 저장하는 모듈

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function saveToExcel(results, outputPath) {
  const dir = path.dirname(outputPath);
  // 저장 경로가 없다면 폴더 생성하기
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 결과 디렉토리 생성: ${dir}`);
  }
  // JSON → Excel 변환
  const sheet = XLSX.utils.json_to_sheet(results);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Result');
  XLSX.writeFile(workbook, outputPath);

  console.log(`📥 Excel 결과 저장 완료: ${outputPath}`);
}

module.exports = saveToExcel;
