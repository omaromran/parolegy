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

export const CAMPAIGN_BLUEPRINT_PROMPT = (
  assessmentData: any,
  documents: any[],
  knowledgeHubContext?: string
) => `
You are an expert parole campaign writer. Generate a complete Campaign Blueprint as a single JSON object. Use ONLY the assessment data and document list below. Do not fabricate facts. Be truthful, concise, and focused on accountability, public safety, and concrete reentry plans. Panel members spend 7–10 minutes per case.

Conflict resolution: If anything below disagrees with the Knowledge Hub (including the "MANDATORY: APPLY EACH STRUCTURE SECTION" mapping), the Knowledge Hub wins. The generic JSON schema is a shape guide; section content, tone, and emphasis must implement the Parole campaign structure entries and LLM guidelines.

PAROLEGY KNOWLEDGE HUB (authoritative — follow this structure and guidance when filling the JSON; align tone, section purposes, and constraints with these instructions):
${knowledgeHubContext?.trim() || '(No knowledge hub content configured.)'}

ASSESSMENT DATA:
${JSON.stringify(assessmentData, null, 2)}

AVAILABLE DOCUMENTS (use these types and file names when citing):
${JSON.stringify(documents.map(d => ({ type: d.type, fileName: d.fileName, id: d.id })), null, 2)}

Return a JSON object with this exact structure (fill every field from the assessment; use empty arrays/strings where no data). Populate each section so it reflects the corresponding Knowledge Hub structure instructions—not generic filler:

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
export type ClientIdentityForNarrative = {
  clientName: string
  tdcjNumber: string
}

export type SupportLetterExcerptForPrompt = {
  id: string
  fileName: string
  text: string
  extractionNote?: string
}

export function buildParoleNarrativePrompt(
  assessmentData: unknown,
  documents: { id: string; type: string; fileName: string }[],
  structureSections: { slug: string; title: string; content: string }[],
  llmGuidelinesText: string,
  clientIdentity?: ClientIdentityForNarrative,
  supportLetters: SupportLetterExcerptForPrompt[] = [],
  machineLearningExamplesBlock?: string
): string {
  const n = structureSections.length
  const order = structureSections.map((s) => s.slug).join(', ')
  const sectionBlocks = structureSections
    .map(
      (s, i) =>
        `#### ${i + 1}. ${s.title}\n- slug (exact): ${s.slug}\n- Staff instructions for this narrative block (apply every line; these override generic tone below for this block only):\n${s.content}`
    )
    .join('\n\n')

  const name = clientIdentity?.clientName?.trim() || ''
  const sid = clientIdentity?.tdcjNumber?.trim() || ''
  const identityBlock =
    name || sid
      ? `=== CLIENT IDENTITY (authoritative — use when referring to this person) ===
Legal / file name to use: ${name || '(name not on file — use assessment only if present)'}
TDCJ #: ${sid || '—'}
When any staff instructions above say to use the client's name, refer to them as "${name || 'the client'}" (or "${name}" consistently). Do not replace the name with generic third-person stand-ins such as "the individual," "the offender," or "this person" unless the staff instructions for that specific numbered section explicitly require distanced wording.`
      : `=== CLIENT IDENTITY ===
(No case name was passed; derive the client's name only from assessment data if present, and follow staff instructions on naming.)`

  const letterBlocks =
    supportLetters.length === 0
      ? '(No support letter text was provided — use only the assessment and document index.)'
      : supportLetters
          .map((s, i) => {
            const note = s.extractionNote ? ` [Extraction: ${s.extractionNote}]` : ''
            const body = s.text?.trim() ? s.text : '(No extractable text for this file.)'
            return `--- Letter ${i + 1} (document id: ${s.id}, file: ${s.fileName})${note} ---\n${body}`
          })
          .join('\n\n')

  return `You are drafting a Texas parole campaign as plain-text narrative blocks for staff to copy. Write exactly ${n} sections in the fixed order below.

Knowledge hub (mandatory): Every section MUST follow the numbered PAROLE_STRUCTURE "Staff instructions" for that slug and MUST respect the PAROLEGY LLM GUIDELINES below wherever they do not conflict with those staff instructions. Staff instructions win per section when there is a conflict.

Precedence (critical): For each numbered section, the "Staff instructions for this narrative block" for that section override conflicting LLM guidelines and any default "neutral" or analytical phrasing habits. If staff instructions require a naming style, voice, or emphasis, implement that first.

${identityBlock}

${sectionBlocks}

${llmGuidelinesText}

=== OFFENSE-TYPE NARRATIVE MODULATION (mandatory) ===
In the PAROLEGY LLM GUIDELINES block above, locate the guideline on **narrative by offense type** (tone, emphasis, and framing). Infer the best-matching offense category **only** from ASSESSMENT DATA and SUPPORT LETTER TEXT (e.g. offense_details, prior_offenses, remorse, programming—never invent charges, victims, or legal outcomes). Apply that guideline consistently across **every** JSON narrative section and slug in order: tone, risk framing, what to emphasize, and plan priorities must align with the inferred category while staying evidence-based. If several categories partially apply, blend them without contradicting facts; if the record is unclear, follow that guideline’s ambiguous/other instructions and keep claims conservative. This works **with** each section’s PAROLE_STRUCTURE staff instructions: do not let offense-type framing override required voice (e.g. first person in the letter) or force facts not in the file.

ASSESSMENT DATA (questionnaire — only use facts from here; do not fabricate):
${JSON.stringify(assessmentData, null, 2)}

SUPPORT LETTER TEXT (extracted from uploaded SUPPORT_LETTER files — use together with the assessment):
Ground supporter names, relationships, quotes, and offers of help in this text and/or the assessment. Do not invent letter content, quotes, or writers not evidenced below. If a letter has no extractable text, do not pretend you read it; you may refer only to the file name and type from the document index.

${letterBlocks}

DOCUMENT INDEX (all uploads: types, names, ids — for reference and citations):
${JSON.stringify(documents, null, 2)}
${
  machineLearningExamplesBlock?.trim()
    ? `
=== PATTERN LIBRARY: PRIOR BEFORE/AFTER EXAMPLES (internal learning — not facts for this case) ===
The account owner stored these excerpts from other matters: “before” is what the client or family submitted; “after” is the Parolegy parole campaign that was produced. Use them **together with** the numbered PAROLE_STRUCTURE staff instructions and the PAROLEGY LLM GUIDELINES above to learn how intake-style materials map into strong, structured campaign narrative (tone, emphasis, section flow, and framing). Do **not** copy names, dates, offenses, institutions, quotes, or other identifying or case-specific facts from these examples into the output for the **current** case. Every substantive claim about this client must still come only from ASSESSMENT DATA and SUPPORT LETTER TEXT (and the document index for file references).

${machineLearningExamplesBlock.trim()}
`
    : ''
}
Return a single JSON object with this exact shape:
{ "sections": [ { "slug": "<string>", "title": "<string>", "content": "<plain text, multiple paragraphs allowed>" } ] }

Hard requirements:
- sections.length === ${n}
- Section order must match slugs exactly: ${order}
- For each item, set slug and title to match the corresponding numbered section above (same slug and title strings).
- For each section, content must satisfy every instruction in that section's "Staff instructions" block. Where staff instructions conflict with LLM guidelines, staff instructions win for that section.
- Substantive claims must be grounded in ASSESSMENT DATA and/or SUPPORT LETTER TEXT (and the document index for file references). Apply LLM guidelines where they do not conflict with staff instructions, including offense-type narrative modulation across all sections when supported by those sources.
${machineLearningExamplesBlock?.trim() ? '- If a PATTERN LIBRARY section appears above, treat it as stylistic and structural guidance only; never import its private facts into this case.' : ''}
${name ? `- When staff instructions call for the client's name, use "${name}" (not depersonalizing substitutes unless that section's staff text explicitly allows them).` : ''}

Output only valid JSON, no markdown code fences or commentary.`
}
