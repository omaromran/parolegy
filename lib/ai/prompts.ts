/**
 * AI Prompt Library for Parolegy
 * 
 * These prompts guide the AI in generating campaign content that is:
 * - Truthful and accurate (no fabrication)
 * - Concise for 7-10 minute review
 * - Focused on accountability + public safety + concrete plan
 * - Respectful, humble, non-defensive
 * - Not implying entitlement to parole
 */

export const SYSTEM_PROMPT = `You are an expert parole campaign writer helping incarcerated individuals in Texas create compelling, truthful, and effective parole campaign materials.

CRITICAL RULES:
1. NEVER fabricate facts, credentials, certificates, or experiences
2. NEVER instruct users to lie, evade, or manipulate unlawfully
3. NEVER imply entitlement to parole - parole is discretionary
4. Focus on accountability, remorse, rehabilitation, and concrete reentry plans
5. Keep content concise - panel members spend only 7-10 minutes per case
6. Use respectful, humble, non-defensive tone
7. Address public safety concerns directly
8. Emphasize concrete plans over promises

Your goal is to help present the truth in the most compelling, structured way possible while maintaining complete honesty and accuracy.`

export const CAMPAIGN_BLUEPRINT_PROMPT = (assessmentData: any, documents: any[]) => `
You are an expert parole campaign writer. Generate a complete Campaign Blueprint as a single JSON object. Use ONLY the assessment data and document list below. Do not fabricate facts. Be truthful, concise, and focused on accountability, public safety, and concrete reentry plans. Panel members spend 7–10 minutes per case.

ASSESSMENT DATA:
${JSON.stringify(assessmentData, null, 2)}

AVAILABLE DOCUMENTS (use these types and file names when citing):
${JSON.stringify(documents.map(d => ({ type: d.type, fileName: d.fileName, id: d.id })), null, 2)}

Return a JSON object with this exact structure (fill every field from the assessment; use empty arrays/strings where no data):

{
  "case_summary": {
    "client_name": "string from assessment",
    "tdcj_number": "string from assessment",
    "key_facts": ["array of 3–6 factual bullets from assessment"]
  },
  "panel_concerns": [
    { "concern": "likely panel concern", "evidence": "fact from case", "mitigation": "how client addresses it" }
  ],
  "narrative_strategy": {
    "themes": ["accountability", "reentry plan", "support network", etc.],
    "tone": "respectful, humble, non-defensive",
    "do_not_say": ["phrases to avoid"]
  },
  "sections": {
    "cover": { "tagline": "short compelling line", "client_photo_available": true/false },
    "toc": ["Synopsis", "Client Letter", "Strengths", "30/90/180 Plan", "Home Plan", "Transportation", "Employment", "Future", "Support Letters", "Closing"],
    "synopsis": { "title": "Executive Summary", "paragraphs": ["2–3 short paragraphs"] },
    "client_letter": { "salutation": "Dear Members of the Board", "paragraphs": ["remorse", "plans", "commitment"], "closing": "Respectfully," },
    "strengths": { "bullets": ["strengths from assessment"] },
    "plan_30_90_180": { "plan_30": ["first 30 days"], "plan_90": ["first 90 days"], "plan_180": ["first 180 days"] },
    "home_plan": { "address": "if in assessment", "description": "text", "stability_factors": ["array"] },
    "transportation": { "description": "text", "details": ["array"] },
    "employment": { "history": ["array"], "opportunities": ["array"], "plan": ["array"] },
    "future": { "goals": ["array"], "commitments": ["array"] },
    "support_letters": { "supporters": [{ "name": "", "relationship": "", "summary": "" }], "letters": [{ "id": "doc ref", "improved_text": "optional" }] },
    "treatment_plan": { "description": "", "commitments": [] },
    "closing": { "paragraphs": ["thank you", "commitment to comply"] }
  },
  "citations_to_user_uploads": [{ "section": "section name", "doc_id": "document id or fileName", "reason": "why cited" }],
  "compliance_checks": { "truthfulness_confirmed": true, "missing_info": ["any gaps"] }
}

Output only valid JSON, no markdown or extra text.
`

export const CLIENT_LETTER_PROMPT = (caseData: any, concerns: string[]) => `
Write a client letter to the parole board for ${caseData.clientName} (TDCJ #${caseData.tdcjNumber}).

The letter must:
- Express genuine remorse and accountability
- Address the following panel concerns: ${concerns.join(', ')}
- Outline concrete reentry plans
- Be humble, respectful, and non-defensive
- Be concise (aim for 2-3 paragraphs)
- Never imply entitlement to parole

Use the assessment data provided to inform the content, but only include truthful information.
`

export const SECTION_IMPROVEMENT_PROMPT = (sectionName: string, currentContent: string, concerns: string[]) => `
Improve the following ${sectionName} section of a parole campaign:

CURRENT CONTENT:
${currentContent}

PANEL CONCERNS TO ADDRESS:
${concerns.join(', ')}

Improvements should:
- Make it more concise for 7-10 minute review
- Better address public safety concerns
- Strengthen accountability and remorse messaging
- Enhance concrete plan details
- Maintain complete truthfulness
- Use respectful, humble tone

Return only the improved content, not explanations.
`
