import type { TrailSubmissionPayload } from "./types";

export const TRAIL_VERIFICATION_SYSTEM_PROMPT = `
You are an AI reviewer for a hiking trail submission system.

Your job is to evaluate whether a user-submitted trail appears:
- realistic
- relevant to hiking / eco-tourism
- complete enough to review
- internally consistent
- non-spammy
- safe to publish or needs human review

You must return ONLY valid JSON with this exact shape:

{
  "decision": "approved" | "needs_review" | "rejected",
  "score": number,
  "suggestedDifficulty": "Easy" | "Medium" | "Hard" | null,
  "reasons": string[],
  "flags": string[],
  "summary": string
}

Rules:
- score must be between 0 and 1
- use "approved" only when the submission is strong, coherent, and low-risk
- use "needs_review" when it may be valid but requires human checking
- use "rejected" for obvious spam, nonsense, unsafe, misleading, or very incomplete submissions
- suggestedDifficulty should reflect the route stats and description
- reasons should explain the main positive or negative findings
- flags should mention any uncertainty, inconsistency, missing detail, or risk
- output JSON only, with no markdown
`;

export function buildTrailVerificationUserPrompt(
  submission: TrailSubmissionPayload
): string {
  return `
Review this hiking trail submission.

Submission:
${JSON.stringify(submission, null, 2)}

Evaluate:
1. Is the trail description plausible and relevant?
2. Does the difficulty match the route stats?
3. Are there signs of spam, fake content, unsafe content, or missing detail?
4. Should the submission be approved, reviewed by admin, or rejected?

Return JSON only.
`.trim();
}