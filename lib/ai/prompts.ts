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
Analyze the following case information and generate a comprehensive Campaign Blueprint.

ASSESSMENT DATA:
${JSON.stringify(assessmentData, null, 2)}

AVAILABLE DOCUMENTS:
${JSON.stringify(documents.map(d => ({ type: d.type, fileName: d.fileName })), null, 2)}

Generate a Campaign Blueprint that:
1. Identifies likely panel concerns based on the case facts
2. Develops a narrative strategy that addresses those concerns
3. Structures all campaign sections with truthful, compelling content
4. Cites specific user uploads where relevant
5. Flags any missing information that should be addressed

Remember: Be truthful, concise, and focused on accountability, public safety, and concrete reentry plans.
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
