// 분석 결과를 Microsoft Teams에 AdaptiveCard 형식으로 전송하는 모듈

const fs = require('fs');
const axios = require('axios');
const https = require('https');

const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL;
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// 결과값에 따라 AdaptiveCard 색상 지정하기
function getColor(result) {
  if (result === 'BENIGN') return 'good';
  if (result === 'MALICIOUS') return 'attention';
  return 'warning';
}

async function sendTeamsAdaptiveCard(results) {
  // 파일 리스트를 카드 항목으로 변환하기
  const facts = results.map((r, i) => ({
    type: 'ColumnSet',
    columns: [
      {
        type: 'Column',
        width: 'stretch',
        items: [
          {
            type: 'TextBlock',
            text: `${i + 1}. ${r.filename}`,
            wrap: true
          }
        ]
      },
      {
        type: 'Column',
        width: 'auto',
        items: [
          {
            type: 'TextBlock',
            text: r.result,
            weight: 'bolder',
            color: getColor(r.result),
            wrap: true
          }
        ]
      }
    ]
  }));

  const payload = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: `✅ API 자동 분석 결과 (총 ${results.length}건)`,
              weight: 'Bolder',
              size: 'Medium'
            },
            {
              type: 'TextBlock',
              text: '분석된 파일 및 상태',
              wrap: true
            },
            ...facts
          ]
        }
      }
    ]
  };

  fs.writeFileSync('adaptive_payload.json', JSON.stringify(payload, null, 2));
  console.log('[DEBUG] 전송 Payload 저장 완료: adaptive_payload.json');
  // Webhook 전송
  try {
    console.log('📨 Teams AdaptiveCard 전송 중...');
    await axios.post(TEAMS_WEBHOOK_URL, payload, { httpsAgent });
    console.log('📨 Teams AdaptiveCard 전송 완료');
  } catch (err) {
    console.error('❌ AdaptiveCard 전송 실패:', err.message);
  }
}

module.exports = sendTeamsAdaptiveCard;
