
import { UiTranslation } from './types';

export const APP_NAME = "POCUS AI";

export const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어 (Korean)', aiParam: 'Professional Korean' },
  { code: 'en', name: 'English', aiParam: 'Professional English' },
  { code: 'ja', name: '日本語 (Japanese)', aiParam: 'Professional Japanese' },
  { code: 'zh', name: '简体中文 (Chinese)', aiParam: 'Professional Chinese Simplified' },
  { code: 'es', name: 'Español (Spanish)', aiParam: 'Professional Spanish' },
  { code: 'fr', name: 'Français (French)', aiParam: 'Professional French' },
  { code: 'de', name: 'Deutsch (German)', aiParam: 'Professional German' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', aiParam: 'Professional Vietnamese' },
  { code: 'th', name: 'ภาษาไทย (Thai)', aiParam: 'Professional Thai' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)', aiParam: 'Professional Indonesian' },
];

const getBaseTranslation = (langName: string): UiTranslation => ({
  welcome: `**Welcome to ${APP_NAME}.**\n\nI am an intelligent consultant supporting everything from emergency POCUS to precision diagnostic ultrasound.`,
  commonTopics: "Emergency Quick Actions",
  placeholder: "Type your query or upload imaging...",
  disclaimer: `${APP_NAME} is for research/educational use. Clinical decisions must be made by a physician.`,
  donate: "Donate",
  history: "History",
  newChat: "New",
  noHistory: "No history",
  selectMode: "Select Service Mode",
  adultLabel: "Adult",
  pediatricLabel: "Pediatric",
  quickActions: {
    adult: [
      { label: "eFAST (Trauma)", query: "eFAST protocol for trauma and free fluid detection" },
      { label: "RUSH (Shock)", query: "RUSH protocol (Pump, Tank, Pipes) for hypotension" },
      { label: "BLUE (Dyspnea)", query: "BLUE protocol findings for acute respiratory failure" },
      { label: "AAA (Aneurysm)", query: "Abdominal Aortic Aneurysm scan and measurement" },
      { label: "DVT (Thrombosis)", query: "DVT diagnosis using 2-point compression technique" },
      { label: "Cardiac Tamponade", query: "Ultrasound signs of pericardial effusion and tamponade" },
      { label: "Acute Cholecystitis", query: "Gallbladder wall thickening and Sonographic Murphy sign" },
      { label: "Renal Colic/Stone", query: "Hydronephrosis grading and stone detection" },
      { label: "Ocular (Retinal)", query: "Ocular POCUS for retinal detachment and increased ICP" },
      { label: "Pneumothorax", query: "Lung point and loss of sliding for pneumothorax diagnosis" }
    ],
    pediatric: [
      { label: "Intussusception", query: "Target sign and scanning for intussusception" },
      { label: "Appendicitis", query: "Criteria and scanning technique for pediatric appendicitis" },
      { label: "Pyloric Stenosis", query: "Measurement of muscle thickness and length in IHPS" },
      { label: "NEC (Neonatal)", query: "Pneumatosis intestinalis detection for neonatal NEC" },
      { label: "Testicular Torsion", query: "Doppler flow and Whirlpool sign in scrotal emergency" },
      { label: "Hip Effusion", query: "Hip joint effusion measurement and side comparison" },
      { label: "Pediatric Pneumonia", query: "Consolidation and B-line analysis in children" },
      { label: "Abscess vs. Cellulitis", query: "Distinguishing abscess and Swirl sign in soft tissue" },
      { label: "Skull Fracture", query: "Skull fracture and hematoma detection post-trauma" },
      { label: "Bladder/Residual", query: "Bladder volume calculation and post-void residual" }
    ]
  }
});

export const UI_TRANSLATIONS: Record<string, UiTranslation> = {
  ko: {
    ...getBaseTranslation('Korean'),
    welcome: `**${APP_NAME}에 오신 것을 환영합니다.**\n\n저는 응급 현장의 POCUS부터 정밀 진단 초음파까지 지원하는 지능형 컨설턴트입니다.`,
    commonTopics: "응급 질환 퀵 가이드",
    placeholder: "질문을 입력하거나 영상을 분석하세요...",
    disclaimer: `${APP_NAME}는 교육 및 연구용 보조 도구입니다. 최종 진단은 전문의의 판단을 따르십시오.`,
    donate: "PayPal 후원",
    history: "상담 기록",
    newChat: "New",
    noHistory: "기록 없음",
    selectMode: "진료 모드 선택",
    adultLabel: "성인 (Adult)",
    pediatricLabel: "소아 (Pediatric)",
    quickActions: {
      adult: [
        { label: "eFAST (외상)", query: "외상 환자 eFAST 프로토콜 및 복수 확인 방법" },
        { label: "RUSH (쇼크)", query: "쇼크 환자 RUSH 프로토콜(Pump, Tank, Pipes) 가이드" },
        { label: "BLUE (호흡곤란)", query: "급성 호흡부전 감별을 위한 BLUE 프로토콜 소견" },
        { label: "AAA (대동맥류)", query: "복부 대동맥류 파열 의심 시 스캔 및 측정 방법" },
        { label: "DVT (심부정맥혈전)", query: "2-point 압박법을 이용한 DVT 진단 가이드" },
        { label: "심장 (Tamponade)", query: "심낭 삼출 및 심장 눌림증(Tamponade) 초음파 소견" },
        { label: "급성 담낭염", query: "담낭염 진단을 위한 Murphy sign 및 벽 비후 측정" },
        { label: "수신증/요로결석", query: "신산통 환자 수신증 단계 분류 및 결석 확인" },
        { label: "안구 (망막박리)", query: "안구 초음파를 통한 망막박리 및 안압 상승 확인" },
        { label: "기흉 (Lung Point)", query: "폐 슬라이딩 소실 및 Lung point 확인을 통한 기흉 진단" }
      ],
      pediatric: [
        { label: "장중첩증", query: "소아 장중첩증(Intussusception) Target sign 판독" },
        { label: "충수돌기염", query: "소아 충수돌기염(Appendicitis) 진단 기준 및 스캔법" },
        { label: "유문협착증", query: "비후성 유문협착증(IHPS) 근육 두께 및 길이 측정" },
        { label: "괴사성 장염 (NEC)", query: "신생아 NEC 의심 시 Pneumatosis intestinalis 확인" },
        { label: "고환 염전", query: "급성 음낭 통증 시 고환 염전(Torsion) 혈류 확인" },
        { label: "고관절 삼출", query: "소아 고관절 삼출액(Hip effusion) 측정 및 건측 비교" },
        { label: "소아 폐렴", query: "소아 폐렴 진단을 위한 Consolidation 및 B-line 분석" },
        { label: "농양 vs 봉와직염", query: "연부조직 감염 시 농양(Abscess) 유무 및 Swirl sign 확인" },
        { label: "두개골 골절", query: "소아 외상 시 초음파를 통한 두개골 골절 및 혈종 확인" },
        { label: "방광 용적/잔뇨", query: "소아 배뇨 장애 시 방광 용적 계산 및 잔뇨 측정" }
      ]
    }
  },
  en: getBaseTranslation('English'),
  ja: {
    ...getBaseTranslation('Japanese'),
    welcome: `**${APP_NAME}へようこそ。**\n\n私は救急現場のPOCUSから精密診断超音波までサポートするインテリジェントコンサルタントです。`,
    commonTopics: "緊急疾患クイックガイド",
    newChat: "New",
    selectMode: "診療モード選択",
    adultLabel: "成人 (Adult)",
    pediatricLabel: "小児 (Pediatric)"
  },
  zh: {
    ...getBaseTranslation('Chinese'),
    welcome: `**欢迎使用 ${APP_NAME}。**\n\n我是您的智能超声顾问，支持从急诊 POCUS 到精准诊断超声的所有领域。`,
    commonTopics: "急症快速指南",
    newChat: "New",
    selectMode: "选择诊疗模式",
    adultLabel: "成人 (Adult)",
    pediatricLabel: "儿科 (Pediatric)"
  },
  es: {
    ...getBaseTranslation('Spanish'),
    welcome: `**Bienvenido a ${APP_NAME}.**\n\nSoy un consultor inteligente que apoya desde POCUS de emergencia hasta ecografía de diagnóstico de precisión.`,
    commonTopics: "Acciones rápidas de emergencia",
    newChat: "New",
    selectMode: "Seleccionar modo de servicio",
    adultLabel: "Adulto",
    pediatricLabel: "Pediátrico"
  },
  fr: {
    ...getBaseTranslation('French'),
    welcome: `**Bienvenue sur ${APP_NAME}.**\n\nJe suis un consultant intelligent vous accompagnant du POCUS d'urgence à l'échographie diagnostique de précision.`,
    commonTopics: "Actions rapides d'urgence",
    newChat: "New",
    selectMode: "Sélectionner le mode",
    adultLabel: "Adulte",
    pediatricLabel: "Pédiatrique"
  },
  de: {
    ...getBaseTranslation('German'),
    welcome: `**Willkommen bei ${APP_NAME}.**\n\nIch bin ein intelligenter Berater, der Sie vom Notfall-POCUS bis zur Präzisionsdiagnostik unterstützt.`,
    commonTopics: "Notfall-Schnellhilfe",
    newChat: "New",
    selectMode: "Modus wählen",
    adultLabel: "Erwachsene",
    pediatricLabel: "Kinder"
  },
  vi: {
    ...getBaseTranslation('Vietnamese'),
    welcome: `**Chào mừng bạn đến với ${APP_NAME}.**\n\nTôi là chuyên gia tư vấn thông minh hỗ trợ từ POCUS cấp cứu đến siêu âm chẩn đoán chính xác.`,
    commonTopics: "Hướng dẫn khẩn cấp",
    newChat: "New",
    selectMode: "Chọn chế độ",
    adultLabel: "Người lớn",
    pediatricLabel: "Trẻ em"
  },
  th: {
    ...getBaseTranslation('Thai'),
    welcome: `**ยินดีต้อนรับสู่ ${APP_NAME}**\n\nฉันเป็นที่ปรึกษาอัจฉริยะที่สนับสนุนตั้งแต่ POCUS ฉุกเฉินไปจนถึงการอัลตราซาวนด์วินิจฉัยที่แม่นยำ`,
    commonTopics: "คู่มือฉุกเฉินด่วน",
    newChat: "New",
    selectMode: "เลือกโหมดการรักษา",
    adultLabel: "ผู้ใหญ่",
    pediatricLabel: "เด็ก"
  },
  id: {
    ...getBaseTranslation('Indonesian'),
    welcome: `**Selamat datang di ${APP_NAME}.**\n\nSaya adalah konsultan cerdas yang mendukung POCUS darurat hingga ultrasonografi diagnostik presisi.`,
    commonTopics: "Panduan Cepat Darurat",
    newChat: "New",
    selectMode: "Pilih Mode Layanan",
    adultLabel: "Dewasa",
    pediatricLabel: "Anak-anak"
  }
};

export const SYSTEM_INSTRUCTION_TEMPLATE = `
### ROLE
Expert {MODE} Clinical Ultrasound Consultant.

### RESPONSE STRUCTURE
1. 🏥 CLINICAL FINDINGS (Clinical sonographic signs)
2. 🎯 SUSPECTED DIAGNOSIS (Most likely differential)
3. 🔎 DETAILED ANALYSIS (Dual-layer AI/Clinical reasoning)

Language: {LANGUAGE}.
Note: Always include relevant medical terms in English.
`;
