// import * as logger from "firebase-functions/logger";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import { openai } from "./openaiClient";
// import {
//   TRAIL_VERIFICATION_SYSTEM_PROMPT,
//   buildTrailVerificationUserPrompt,
// } from "./prompts";
// import type {
//   TrailSubmissionPayload,
//   AIVerificationResult,
// } from "./types";

// const db = getFirestore();

// function normalizeResult(raw: any): AIVerificationResult {
//   const decision =
//     raw?.decision === "approved" ||
//     raw?.decision === "needs_review" ||
//     raw?.decision === "rejected"
//       ? raw.decision
//       : "needs_review";

//   const suggestedDifficulty =
//     raw?.suggestedDifficulty === "Easy" ||
//     raw?.suggestedDifficulty === "Medium" ||
//     raw?.suggestedDifficulty === "Hard"
//       ? raw.suggestedDifficulty
//       : null;

//   const score =
//     typeof raw?.score === "number"
//       ? Math.max(0, Math.min(1, raw.score))
//       : 0.5;

//   return {
//     decision,
//     score,
//     suggestedDifficulty,
//     reasons: Array.isArray(raw?.reasons) ? raw.reasons.map(String) : [],
//     flags: Array.isArray(raw?.flags) ? raw.flags.map(String) : [],
//     summary:
//       typeof raw?.summary === "string"
//         ? raw.summary
//         : "No summary returned by AI.",
//   };
// }

// export const verifyTrailSubmission = onDocumentCreated(
//   "trail_submissions/{submissionId}",
//   async (event) => {
//     const snapshot = event.data;
//     if (!snapshot) return;

//     const submissionId = event.params.submissionId;
//     const data = snapshot.data() as TrailSubmissionPayload;

//     logger.info("Starting AI verification", { submissionId });

//     try {
//       const response = await openai.responses.create({
//         model: "gpt-5.4",
//         input: [
//           {
//             role: "system",
//             content: [{ type: "input_text", text: TRAIL_VERIFICATION_SYSTEM_PROMPT }],
//           },
//           {
//             role: "user",
//             content: [
//               {
//                 type: "input_text",
//                 text: buildTrailVerificationUserPrompt(data),
//               },
//             ],
//           },
//         ],
//       });

//       const text = response.output_text;
//       if (!text) {
//         throw new Error("Empty AI response");
//       }

//       const parsed = JSON.parse(text);
//       const result = normalizeResult(parsed);

//       const finalStatus =
//         result.decision === "approved"
//           ? "approved"
//           : result.decision === "rejected"
//           ? "rejected"
//           : "needs_review";

//       await db.collection("trail_submissions").doc(submissionId).update({
//         status: finalStatus,
//         aiVerification: {
//           decision: result.decision,
//           score: result.score,
//           suggestedDifficulty: result.suggestedDifficulty,
//           reasons: result.reasons,
//           flags: result.flags,
//           summary: result.summary,
//           verifiedAt: FieldValue.serverTimestamp(),
//           model: "gpt-5.4",
//         },
//         updatedAt: FieldValue.serverTimestamp(),
//       });

//       logger.info("AI verification completed", {
//         submissionId,
//         decision: result.decision,
//         score: result.score,
//       });
//     } catch (error: any) {
//       logger.error("AI verification failed", {
//         submissionId,
//         error: error?.message || String(error),
//       });

//       await db.collection("trail_submissions").doc(submissionId).update({
//         status: "needs_review",
//         aiVerification: {
//           decision: "needs_review",
//           score: 0,
//           suggestedDifficulty: null,
//           reasons: ["Automatic verification failed."],
//           flags: [error?.message || "Unknown AI verification error"],
//           summary: "Submission needs manual review because AI verification failed.",
//           verifiedAt: FieldValue.serverTimestamp(),
//           model: "gpt-5.4",
//         },
//         updatedAt: FieldValue.serverTimestamp(),
//       });
//     }
//   }
// );


import * as logger from "firebase-functions/logger";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getGeminiClient } from "./geminiClient";
// import { getOpenAIClient } from "./openaiClient";
import {
  TRAIL_VERIFICATION_SYSTEM_PROMPT,
  buildTrailVerificationUserPrompt,
} from "./prompts";
import type {
  TrailSubmissionPayload,
  AIVerificationResult,
} from "./types";

const db = getFirestore();

function normalizeResult(raw: any): AIVerificationResult {
  const decision =
    raw?.decision === "approved" ||
    raw?.decision === "needs_review" ||
    raw?.decision === "rejected"
      ? raw.decision
      : "needs_review";

  const suggestedDifficulty =
    raw?.suggestedDifficulty === "Easy" ||
    raw?.suggestedDifficulty === "Medium" ||
    raw?.suggestedDifficulty === "Hard"
      ? raw.suggestedDifficulty
      : null;

  const score =
    typeof raw?.score === "number"
      ? Math.max(0, Math.min(1, raw.score))
      : 0.5;

  return {
    decision,
    score,
    suggestedDifficulty,
    reasons: Array.isArray(raw?.reasons) ? raw.reasons.map(String) : [],
    flags: Array.isArray(raw?.flags) ? raw.flags.map(String) : [],
    summary:
      typeof raw?.summary === "string"
        ? raw.summary
        : "No summary returned by AI.",
  };
}

export const verifyTrailSubmission = onDocumentCreated(
  {
    document: "trail_submissions/{submissionId}",
    region: "us-central1",
    // secrets: ["OPENAI_API_KEY"],
    secrets: ["GEMINI_API_KEY"]
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const submissionId = event.params.submissionId;
    const data = snapshot.data() as TrailSubmissionPayload;

    logger.info("Starting AI verification", { submissionId });

//     try {
//       const openai = getOpenAIClient();
//       const response = await openai.responses.create({
//         model: "gpt-4.1-mini",
//         input: [
//           {
//             role: "system",
//             content: [
//               {
//                 type: "input_text",
//                 text: TRAIL_VERIFICATION_SYSTEM_PROMPT,
//               },
//             ],
//           },
//           {
//             role: "user",
//             content: [
//               {
//                 type: "input_text",
//                 text: buildTrailVerificationUserPrompt(data),
//               },
//             ],
//           },
//         ],
//       });

//       const text = response.output_text;
//       if (!text) {
//         throw new Error("Empty AI response");
//       }

//       const parsed = JSON.parse(text);
//       const result = normalizeResult(parsed);

//       const finalStatus =
//         result.decision === "approved"
//           ? "approved"
//           : result.decision === "rejected"
//           ? "rejected"
//           : "needs_review";

//       await db.collection("trail_submissions").doc(submissionId).update({
//         status: finalStatus,
//         aiVerification: {
//           decision: result.decision,
//           score: result.score,
//           suggestedDifficulty: result.suggestedDifficulty,
//           reasons: result.reasons,
//           flags: result.flags,
//           summary: result.summary,
//           verifiedAt: FieldValue.serverTimestamp(),
//           model: "gpt-4.1-mini",
//         },
//         updatedAt: FieldValue.serverTimestamp(),
//       });

//       logger.info("AI verification completed", {
//         submissionId,
//         decision: result.decision,
//         score: result.score,
//       });
//     } catch (error: any) {
//       logger.error("AI verification failed", {
//         submissionId,
//         error: error?.message || String(error),
//       });

//       await db.collection("trail_submissions").doc(submissionId).update({
//         status: "needs_review",
//         aiVerification: {
//           decision: "needs_review",
//           score: 0,
//           suggestedDifficulty: null,
//           reasons: ["Automatic verification failed."],
//           flags: [error?.message || "Unknown AI verification error"],
//           summary: "Submission needs manual review because AI verification failed.",
//           verifiedAt: FieldValue.serverTimestamp(),
//           model: "gpt-4.1-mini",
//         },
//         updatedAt: FieldValue.serverTimestamp(),
//       });
//     }
//   }
// );

try {
      const model = getGeminiClient();

      const prompt = `
${TRAIL_VERIFICATION_SYSTEM_PROMPT}

${buildTrailVerificationUserPrompt(data)}

Return ONLY valid JSON in this exact shape:
{
  "decision": "approved",
  "score": 0.0,
  "suggestedDifficulty": "Easy",
  "reasons": ["reason"],
  "flags": ["flag"],
  "summary": "summary"
}

Allowed values:
- decision: "approved" | "needs_review" | "rejected"
- suggestedDifficulty: "Easy" | "Medium" | "Hard" | null
- score: number between 0 and 1
`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();

      if (!text) {
        throw new Error("Empty AI response");
      }

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);
      const result = normalizeResult(parsed);

      const finalStatus =
        result.decision === "approved"
          ? "approved"
          : result.decision === "rejected"
          ? "rejected"
          : "needs_review";

      await db.collection("trail_submissions").doc(submissionId).update({
        status: finalStatus,
        aiVerification: {
          decision: result.decision,
          score: result.score,
          suggestedDifficulty: result.suggestedDifficulty,
          reasons: result.reasons,
          flags: result.flags,
          summary: result.summary,
          verifiedAt: FieldValue.serverTimestamp(),
          model: "gemini-1.5-flash-8b",
        },
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info("AI verification completed", {
        submissionId,
        decision: result.decision,
        score: result.score,
      });
    } catch (error: any) {
      logger.error("AI verification failed", {
        submissionId,
        error: error?.message || String(error),
      });

      await db.collection("trail_submissions").doc(submissionId).update({
        status: "needs_review",
        aiVerification: {
          decision: "needs_review",
          score: 0,
          suggestedDifficulty: null,
          reasons: ["Automatic verification failed."],
          flags: [error?.message || "Unknown AI verification error"],
          summary: "Submission needs manual review because AI verification failed.",
          verifiedAt: FieldValue.serverTimestamp(),
          model: "gemini-1.5-flash-8b",
        },
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }
);