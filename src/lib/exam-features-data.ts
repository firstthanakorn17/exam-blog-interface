export interface PracticeQuestion {
  id: string;
  subject: "math" | "thai" | "english";
  subjectLabel: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeExamSet {
  id: string;
  title: string;
  organization: string;
  durationMinutes: number;
  passScorePct: number;
  level: string;
  badge: string;
  questions: PracticeQuestion[];
}

export interface ExamCalendarEvent {
  id: string;
  title: string;
  organization: string;
  category: "ก.พ. & ราชการ" | "ท้องถิ่น" | "รัฐวิสาหกิจ";
  degreeLevel: "ปวช./ปวส." | "ปริญญาตรี" | "ปริญญาโท";
  month: string;
  applyWindow: string;
  examDate: string;
  seatsOrPositions: string;
  status: "เปิดรับสมัคร" | "กำลังจะเปิด" | "ประกาศวันสอบแล้ว";
  officialUrl: string;
}

export const PRACTICE_EXAM_SETS: PracticeExamSet[] = [
  {
    id: "ocsc-69",
    title: "ชุดจำลองสอบ ก.พ. ภาค ก. (Paper & e-Exam) ปี 2569",
    organization: "สำนักงาน ก.พ. (OCSC)",
    durationMinutes: 15,
    passScorePct: 60,
    level: "ปริญญาตรี / ปริญญาโท",
    badge: "ยอดนิยมอันดับ 1",
    questions: [
      {
        id: "q-ocsc-1",
        subject: "math",
        subjectLabel: "ความสามารถในการคิดวิเคราะห์ (คณิต/อนุกรม)",
        question: "จงหาพจน์ถัดไปของอนุกรมต่อไปนี้: 4, 9, 19, 39, 79, ...",
        choices: ["149", "159", "169", "179"],
        correctIndex: 1,
        explanation:
          "ระยะห่างเพิ่มขึ้นเป็น 2 เท่า: +5, +10, +20, +40 ดังนั้นพจน์ถัดไปคือ 79 + 80 = 159",
      },
      {
        id: "q-ocsc-2",
        subject: "math",
        subjectLabel: "ความสามารถในการคิดวิเคราะห์ (คณิต/อนุกรม)",
        question:
          "พนักงานราชการ 25 คน ช่วยกันคัดแยกเอกสารเสร็จในเวลา 12 วัน หากต้องการให้เสร็จภายใน 6 วัน จะต้องเพิ่มพนักงานอีกกี่คน?",
        choices: ["25 คน", "35 คน", "50 คน", "15 คน"],
        correctIndex: 0,
        explanation:
          "งานรวม = 25 × 12 = 300 คน-วัน หากทำใน 6 วัน ต้องใช้คน = 300 / 6 = 50 คน จึงต้องเพิ่มอีก 50 - 25 = 25 คน",
      },
      {
        id: "q-ocsc-3",
        subject: "thai",
        subjectLabel: "ภาษาไทย (การเรียงประโยค & บทความ)",
        question:
          "ข้อใดใช้คำราชาศัพท์หรือสำนวนภาษาทางราชการได้ถูกต้องตามหลักเกณฑ์ของสำนักงาน ก.พ.?",
        choices: [
          "ขอเชิญท่านเข้าร่วมประชุมเพื่อทำการพิจารณาโครงการ",
          "จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ",
          "ทางหน่วยงานได้ทำการจัดส่งเอกสารให้ท่านเรียบร้อยแล้ว",
          "มีความประสงค์จะขอทำการเบิกจ่ายงบประมาณประจำปี",
        ],
        correctIndex: 1,
        explanation:
          "ภาษาหนังสือราชการไม่ใช้คำฟุ่มเฟือยอย่าง 'ทำการ...' ดังนั้น 'จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ' จึงกระชับและถูกต้องตามระเบียบงานสารบรรณ",
      },
      {
        id: "q-ocsc-4",
        subject: "thai",
        subjectLabel: "ภาษาไทย (การเรียงประโยค & บทความ)",
        question:
          "ข้อใดเรียงลำดับข้อความต่อไปนี้ได้ถูกต้องตามหลักตรรกะ? (1) ส่งผลให้ประชาชนเข้าถึงบริการภาครัฐได้สะดวกรวดเร็วขึ้น (2) การพัฒนาระบบรัฐบาลดิจิทัลเป็นหัวใจสำคัญของการปฏิรูปภาครัฐ (3) โดยเชื่อมโยงฐานข้อมูลระหว่างหน่วยงานเข้าด้วยกัน (4) เพื่อลดขั้นตอนการยื่นเอกสารซ้ำซ้อน",
        choices: [
          "(2) - (3) - (4) - (1)",
          "(2) - (4) - (1) - (3)",
          "(3) - (2) - (4) - (1)",
          "(4) - (2) - (3) - (1)",
        ],
        correctIndex: 0,
        explanation:
          "เริ่มจากประโยคหลัก (2) การพัฒนาระบบรัฐบาลดิจิทัล -> ขยายวิธีการ (3) เชื่อมโยงฐานข้อมูล -> วัตถุประสงค์ (4) ลดเอกสารซ้ำซ้อน -> ผลลัพธ์ปลายทาง (1)",
      },
      {
        id: "q-ocsc-5",
        subject: "english",
        subjectLabel: "ภาษาอังกฤษ (Structure & Reading)",
        question:
          "All applicants _______ their online registration forms before the deadline next Friday.",
        choices: [
          "must submit",
          "must submitting",
          "have been submit",
          "submits",
        ],
        correctIndex: 0,
        explanation:
          "หลัง Modal Verb (must, should, can, will) ต้องตามด้วยกริยาช่องที่ 1 รูป Infinitive without to คือ 'must submit'",
      },
      {
        id: "q-ocsc-6",
        subject: "english",
        subjectLabel: "ภาษาอังกฤษ (Structure & Reading)",
        question:
          "The committee decided to _______ the examination date due to severe flooding in several provinces.",
        choices: ["postpone", "expand", "construct", "persuade"],
        correctIndex: 0,
        explanation:
          "postpone แปลว่า เลื่อนออกไป (put off) ซึ่งสอดคล้องกับบริบทน้ำท่วมในหลายจังหวัด",
      },
    ],
  },
  {
    id: "dla-69",
    title: "ชุดจำลองสอบท้องถิ่น ภาค ก. (กรมส่งเสริมการปกครองท้องถิ่น) ปี 2569",
    organization: "กรมส่งเสริมการปกครองท้องถิ่น (สถ.)",
    durationMinutes: 15,
    passScorePct: 60,
    level: "ปวช. / ปวส. / ปริญญาตรี",
    badge: "8,540 อัตรา",
    questions: [
      {
        id: "q-dla-1",
        subject: "math",
        subjectLabel: "ความสามารถทั่วไป (คณิตศาสตร์ท้องถิ่น)",
        question:
          "งบประมาณพัฒนาตำบล 1,200,000 บาท จัดสรรทำถนนคอนกรีต 45% ที่เหลือจัดสรรทำระบบประปาหมู่บ้าน คิดเป็นเงินทำระบบประปาเท่าใด?",
        choices: [
          "540,000 บาท",
          "600,000 บาท",
          "660,000 บาท",
          "720,000 บาท",
        ],
        correctIndex: 2,
        explanation:
          "ส่วนที่เหลือคือ 100% - 45% = 55% ของ 1,200,000 บาท = 0.55 × 1,200,000 = 660,000 บาท",
      },
      {
        id: "q-dla-2",
        subject: "thai",
        subjectLabel: "ภาษาไทย & พ.ร.บ. ท้องถิ่น",
        question:
          "ตามระเบียบงานสารบรรณ คำขึ้นต้นหนังสือราชการที่เรียน 'ผู้ว่าราชการจังหวัด' ข้อใดถูกต้อง?",
        choices: [
          "กราบเรียน ผู้ว่าราชการจังหวัด...",
          "เรียน ผู้ว่าราชการจังหวัด...",
          "เสนอ ผู้ว่าราชการจังหวัด...",
          "แจ้ง ผู้ว่าราชการจังหวัด...",
        ],
        correctIndex: 1,
        explanation:
          "'กราบเรียน' ใช้เฉพาะประธานองคมนตรี นายกรัฐมนตรี ประธานรัฐสภา ประธานสภาผู้แทนราษฎร ประธานวุฒิสภา ประธานศาลฎีกา ประธานศาลรัฐธรรมนูญ ประธานศาลปกครองสูงสุด และประธานองค์กรอิสระ ส่วนผู้ว่าราชการจังหวัดใช้ 'เรียน'",
      },
      {
        id: "q-dla-3",
        subject: "english",
        subjectLabel: "ภาษาอังกฤษสำหรับข้าราชการส่วนท้องถิ่น",
        question:
          "Please contact the Human Resources Department if you require any further _______ regarding the recruitment process.",
        choices: ["inform", "informed", "information", "informative"],
        correctIndex: 2,
        explanation:
          "หลังคำคุณศัพท์ further ต้องตามด้วยคำนาม (Noun) คือ information (ข้อมูลข่าวสาร)",
      },
    ],
  },
  {
    id: "egat-69",
    title: "ชุดจำลองสอบความถนัด กฟผ. (EGAT Aptitude & Technical) ปี 2569",
    organization: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.)",
    durationMinutes: 15,
    passScorePct: 65,
    level: "ปวส. / ปริญญาตรี / ปริญญาโท",
    badge: "รัฐวิสาหกิจโบนัสดี",
    questions: [
      {
        id: "q-egat-1",
        subject: "math",
        subjectLabel: "Aptitude & Numerical Reasoning",
        question:
          "โรงไฟฟ้าพลังงานแสงอาทิตย์ผลิตไฟฟ้าได้เพิ่มขึ้นจาก 250 MW เป็น 325 MW คิดเป็นอัตราการเพิ่มขึ้นกี่เปอร์เซ็นต์?",
        choices: ["25%", "30%", "35%", "40%"],
        correctIndex: 1,
        explanation:
          "เพิ่มขึ้น = 325 - 250 = 75 MW คิดเป็นร้อยละ (75 / 250) × 100 = 30%",
      },
      {
        id: "q-egat-2",
        subject: "thai",
        subjectLabel: "การวิเคราะห์เหตุผลเชิงตรรกะ",
        question:
          "ถ้า 'วิศวกรทุกคนต้องผ่านการอบรมความปลอดภัย' และ 'สมชายเป็นวิศวกรของ กฟผ.' ข้อสรุปใดถูกต้องแน่นอน?",
        choices: [
          "คนที่ผ่านการอบรมความปลอดภัยทุกคนเป็นวิศวกร",
          "สมชายผ่านการอบรมความปลอดภัย",
          "พนักงาน กฟผ. ทุกคนเป็นวิศวกร",
          "สมชายเป็นหัวหน้าแผนกความปลอดภัย",
        ],
        correctIndex: 1,
        explanation:
          "ตามหลักตรรกศาสตร์ซิลโลจิสซึม เมื่อ A ⊂ B และ สมชาย ∈ A ดังนั้น สมชาย ∈ B (สมชายผ่านการอบรมความปลอดภัยแน่นอน)",
      },
      {
        id: "q-egat-3",
        subject: "english",
        subjectLabel: "TOEIC-Style Business English",
        question:
          "The maintenance team _______ inspecting the high-voltage transmission lines by the time the storm arrives.",
        choices: [
          "will have finished",
          "finished",
          "has been finished",
          "was finishing",
        ],
        correctIndex: 0,
        explanation:
          "มีตัวบอกเวลา 'by the time + Present Simple' ต้องใช้คู่กับ Future Perfect (will have + V.3) เพื่อระบุเหตุการณ์ที่จะเสร็จสิ้นก่อนอีกเหตุการณ์ในอนาคต",
      },
    ],
  },
];

export const EXAM_CALENDAR_EVENTS: ExamCalendarEvent[] = [
  {
    id: "cal-ocsc-69",
    title: "สอบ ก.พ. ภาค ก. ประจำปี 2569 (e-Exam & Paper)",
    organization: "สำนักงานคณะกรรมการข้าราชการพลเรือน (สำนักงาน ก.พ.)",
    category: "ก.พ. & ราชการ",
    degreeLevel: "ปริญญาตรี",
    month: "พฤศจิกายน 2569",
    applyWindow: "15 พ.ย. – 5 ธ.ค. 2569",
    examDate: "มี.ค. – พ.ค. 2570",
    seatsOrPositions: "450,000 ที่นั่งสอบ",
    status: "เปิดรับสมัคร",
    officialUrl: "https://job3.ocsc.go.th",
  },
  {
    id: "cal-dla-69",
    title: "สอบแข่งขันบรรจุข้าราชการส่วนท้องถิ่น ปี 2569",
    organization: "กรมส่งเสริมการปกครองท้องถิ่น (สถ.)",
    category: "ท้องถิ่น",
    degreeLevel: "ปริญญาตรี",
    month: "พฤศจิกายน 2569",
    applyWindow: "20 พ.ย. – 12 ธ.ค. 2569",
    examDate: "ก.พ. 2570",
    seatsOrPositions: "8,540 อัตราทั่วประเทศ",
    status: "เปิดรับสมัคร",
    officialUrl: "https://dlaapplicant2569.Thaijobjob.com",
  },
  {
    id: "cal-rd-69",
    title: "สอบบรรจุข้าราชการกรมสรรพากร (นักวิชาการสรรพากร/ภาษี)",
    organization: "กรมสรรพากร กระทรวงการคลัง",
    category: "ก.พ. & ราชการ",
    degreeLevel: "ปริญญาตรี",
    month: "พฤศจิกายน 2569",
    applyWindow: "18 พ.ย. – 10 ธ.ค. 2569",
    examDate: "ม.ค. 2570",
    seatsOrPositions: "450 อัตรา",
    status: "เปิดรับสมัคร",
    officialUrl: "https://rd.thaijobjob.com",
  },
  {
    id: "cal-egat-69",
    title: "รับสมัครพนักงานรัฐวิสาหกิจ กฟผ. (EGAT) ประจำปี 2569",
    organization: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.)",
    category: "รัฐวิสาหกิจ",
    degreeLevel: "ปริญญาโท",
    month: "ธันวาคม 2569",
    applyWindow: "1 – 20 ธ.ค. 2569",
    examDate: "ก.พ. 2570",
    seatsOrPositions: "320 อัตรา",
    status: "กำลังจะเปิด",
    officialUrl: "https://www.egat.co.th/home/job-opportunity",
  },
  {
    id: "cal-bma-69",
    title: "สอบบรรจุข้าราชการกรุงเทพมหานคร สามัญ ครั้งที่ 2/2569",
    organization: "สำนักงาน ก.ก. กรุงเทพมหานคร",
    category: "ท้องถิ่น",
    degreeLevel: "ปวช./ปวส.",
    month: "ธันวาคม 2569",
    applyWindow: "5 – 25 ธ.ค. 2569",
    examDate: "ก.พ. 2570",
    seatsOrPositions: "1,120 อัตรา",
    status: "กำลังจะเปิด",
    officialUrl: "https://ksb.bangkok.go.th",
  },
  {
    id: "cal-customs-69",
    title: "สอบแข่งขันเข้ารับราชการกรมศุลกากร (นักวิชาการศุลกากร)",
    organization: "กรมศุลกากร กระทรวงการคลัง",
    category: "ก.พ. & ราชการ",
    degreeLevel: "ปริญญาตรี",
    month: "มกราคม 2570",
    applyWindow: "10 – 31 ม.ค. 2570",
    examDate: "มี.ค. 2570",
    seatsOrPositions: "180 อัตรา",
    status: "ประกาศวันสอบแล้ว",
    officialUrl: "https://customs.thaijobjob.com",
  },
];
