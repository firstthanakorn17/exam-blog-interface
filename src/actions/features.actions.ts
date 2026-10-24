"use server";

import { cookies } from "next/headers";
import { refresh, updateTag } from "next/cache";
import { after } from "next/server";

export interface ScoreCalculationResult {
  thaiScore: number;
  mathScore: number;
  englishScore: number;
  lawScore: number;
  generalTotalPct: number;
  englishPct: number;
  lawPct: number;
  passedGeneral: boolean;
  passedEnglish: boolean;
  passedLaw: boolean;
  overallPassed: boolean;
  percentileRank: number;
  recommendation: string;
  calculatedAt: string;
  candidateCode?: string;
}

export interface ScoreCalculatorState {
  result?: ScoreCalculationResult;
  error?: string;
}

// In-memory recent calculation log updated non-blockingly via Next.js 16 after()
const recentScoreLogs: {
  id: string;
  level: string;
  passed: boolean;
  generalPct: number;
  createdAt: string;
}[] = [
  {
    id: "calc-seed-1",
    level: "ปริญญาตรี",
    passed: true,
    generalPct: 74,
    createdAt: "2026-10-24T13:30:00.000Z",
  },
  {
    id: "calc-seed-2",
    level: "ปริญญาโท",
    passed: true,
    generalPct: 81,
    createdAt: "2026-10-24T13:45:00.000Z",
  },
  {
    id: "calc-seed-3",
    level: "ปริญญาตรี",
    passed: false,
    generalPct: 58,
    createdAt: "2026-10-24T14:00:00.000Z",
  },
];

export async function getRecentScoreStats() {
  const total = recentScoreLogs.length;
  const passCount = recentScoreLogs.filter((r) => r.passed).length;
  const avgGeneral =
    total > 0
      ? Math.round(
          recentScoreLogs.reduce((acc, r) => acc + r.generalPct, 0) / total
        )
      : 0;
  return {
    totalSubmissions: total,
    passRatePct: total > 0 ? Math.round((passCount / total) * 100) : 0,
    avgGeneralPct: avgGeneral,
    recentLogs: recentScoreLogs.slice(0, 5),
  };
}

export async function calculateScoreAction(
  _prevState: ScoreCalculatorState,
  formData: FormData
): Promise<ScoreCalculatorState> {
  const degreeLevel =
    (formData.get("degreeLevel") as string | null) || "ปริญญาตรี";
  const candidateCode =
    (formData.get("candidateCode") as string | null)?.trim() || "OCSC-69001";
  const thaiScore = Number(formData.get("thaiScore") || 0); // max 50
  const mathScore = Number(formData.get("mathScore") || 0); // max 50
  const englishScore = Number(formData.get("englishScore") || 0); // max 50
  const lawScore = Number(formData.get("lawScore") || 0); // max 50

  if (
    thaiScore < 0 ||
    thaiScore > 50 ||
    mathScore < 0 ||
    mathScore > 50 ||
    englishScore < 0 ||
    englishScore > 50 ||
    lawScore < 0 ||
    lawScore > 50
  ) {
    return {
      error: "กรุณากรอกคะแนนแต่ละวิชาให้อยู่ในช่วง 0 ถึง 50 คะแนน",
    };
  }

  const requiredGeneralPct = degreeLevel === "ปริญญาโท" ? 65 : 60;
  const generalTotalPct = Math.round(((thaiScore + mathScore) / 100) * 100);
  const englishPct = Math.round((englishScore / 50) * 100);
  const lawPct = Math.round((lawScore / 50) * 100);

  const passedGeneral = generalTotalPct >= requiredGeneralPct;
  const passedEnglish = englishPct >= 50;
  const passedLaw = lawPct >= 60;
  const overallPassed = passedGeneral && passedEnglish && passedLaw;

  const composite = Math.round(
    (generalTotalPct * 0.45 + englishPct * 0.25 + lawPct * 0.3) * 10
  ) / 10;
  const percentileRank = Math.min(99, Math.max(12, Math.round(composite + 8)));

  let recommendation =
    "คะแนนผ่านเกณฑ์ครบทุกวิชา! แนะนำให้ฝึกทำโจทย์จับเวลาจริงในหน้าจำลองสอบเพื่อรักษาความแม่นยำ";
  if (!overallPassed) {
    const weak: string[] = [];
    if (!passedGeneral)
      weak.push(`ความสามารถทั่วไป+ภาษาไทย (ต้องได้ ≥${requiredGeneralPct}%)`);
    if (!passedEnglish) weak.push("ภาษาอังกฤษ (ต้องได้ ≥50%)");
    if (!passedLaw) weak.push("ความรู้และลักษณะการเป็นข้าราชการที่ดี (ต้องได้ ≥60%)");
    recommendation = `ควรเร่งเสริมวิชา: ${weak.join(", ")} เพื่อให้ผ่านเกณฑ์ขั้นต่ำของ ก.พ.`;
  }

  const calculatedAt = new Date().toISOString();

  // Next.js 16 after() schedules non-blocking analytics/logging work after the response finishes
  after(() => {
    recentScoreLogs.unshift({
      id: `calc-${Date.now()}`,
      level: degreeLevel,
      passed: overallPassed,
      generalPct: generalTotalPct,
      createdAt: calculatedAt,
    });
    if (recentScoreLogs.length > 20) {
      recentScoreLogs.pop();
    }
  });

  updateTag("score-stats");
  // Next.js 16 refresh() refreshes the client router from inside a Server Action
  refresh();

  return {
    result: {
      thaiScore,
      mathScore,
      englishScore,
      lawScore,
      generalTotalPct,
      englishPct,
      lawPct,
      passedGeneral,
      passedEnglish,
      passedLaw,
      overallPassed,
      percentileRank,
      recommendation,
      calculatedAt,
      candidateCode,
    },
  };
}

export async function saveTargetPreferenceAction(formData: FormData) {
  const targetLevel =
    (formData.get("targetLevel") as string | null) || "ปริญญาตรี";
  const targetTrack =
    (formData.get("targetTrack") as string | null) || "ก.พ. & ท้องถิ่น";

  const cookieStore = await cookies();
  cookieStore.set("exam_target_level", targetLevel, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  cookieStore.set("exam_target_track", targetTrack, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  refresh();
}

export async function setVaultRoleAction(formData: FormData) {
  const role = (formData.get("role") as string | null) || "vip";
  const cookieStore = await cookies();
  if (role === "guest") {
    cookieStore.delete("vault_role");
  } else {
    cookieStore.set("vault_role", role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  refresh();
}
