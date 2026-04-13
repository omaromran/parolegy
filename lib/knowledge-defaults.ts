/** Seed rows for KnowledgeHubEntry when the table is empty. Editable in Admin → Knowledge hub. */

export type KnowledgeSeed = {
  category: 'PAROLE_STRUCTURE' | 'LLM_GUIDELINES'
  slug: string
  title: string
  content: string
  sortOrder: number
}

export const KNOWLEDGE_DEFAULTS: KnowledgeSeed[] = [
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-1-synopsis',
    title: 'Section 1 — Campaign Synopsis (Analytical Overview)',
    sortOrder: 1,
    content: `Describe how this section should read in the final campaign: analytical overview, 2–3 tight paragraphs that orient the panel to who the person is today, the offense context in one sentence, and what the file will prove. You may use the client's name (from Client identity) when the campaign needs a human-centered read; avoid defaulting to distant phrases like "the individual" unless you intentionally want a depersonalized synopsis. No advocacy adjectives in the synopsis—save persuasion for the letter and plans.`,
  },
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-2-letter',
    title: "Section 2 — The Individual's Letter to the Board",
    sortOrder: 2,
    content: `Voice: first person, accountable, specific remorse without performance. Must include concrete reentry commitments tied to assessment facts. Never demand release; request fair consideration. Length: panel-readable (typically 2–4 short paragraphs plus closing).`,
  },
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-3-behavioral',
    title: 'Section 3 — Behavioral & Psychological Analysis ("Things You Should Know")',
    sortOrder: 3,
    content: `Frame as "what reviewers should understand" about growth, programming, insight, and stability—grounded in verifiable facts from the file. Avoid clinical jargon unless supported by records. Connect behavior change to public safety and supervision compliance.`,
  },
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-4-parole-plan',
    title: 'Section 4 — Parole Plan',
    sortOrder: 4,
    content: `Structured 30/90/180 (or equivalent) with housing, employment, transportation, compliance (reporting, treatment), and contingency if something falls through. Each bucket must map to something the client or family has actually arranged or can credibly pursue per assessment.`,
  },
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-5-support',
    title: 'Section 5 — Support Letters',
    sortOrder: 5,
    content: `Summaries should reflect credibility (relationship, length of relationship, concrete help offered). Do not invent quotes. Tie supporters to specific roles (housing, job search, transportation, accountability).`,
  },
  {
    category: 'PAROLE_STRUCTURE',
    slug: 'section-6-treatment',
    title: 'Section 6 — Post-Release Treatment & Reentry Plan',
    sortOrder: 6,
    content: `Treatment compliance, aftercare, counseling, UA plan if applicable, and how risk is managed after release. Align with conditions the panel might set.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'language-standards',
    title: 'Language standards (Parolegy LLM)',
    sortOrder: 10,
    content: `Use plain, respectful English. Prefer active voice and short sentences. Avoid slang that trivializes harm. No guarantees of success; use "plan to," "committed to," "will comply." Texas board context: formal but human.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'six-pattern-disruption',
    title: 'The six pattern disruption indicators (must run through the entire campaign)',
    sortOrder: 11,
    content: `[Edit this list with your agency’s six indicators.] Example placeholders: (1) accountability without minimization, (2) remorse tied to harm understood, (3) verifiable programming/participation, (4) realistic housing and income path, (5) pro-social network with skin in the game, (6) specific plan for high-risk situations.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'core-psychological-architecture',
    title: 'Core psychological architecture',
    sortOrder: 12,
    content: `Describe how Parolegy wants the narrative to feel to a stressed reviewer: clarity first, fear addressed early, hope grounded in behavior not slogans. The reader should finish believing the person understands why parole is serious and what they will do differently.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'decision-making-fears',
    title: 'Their specific decision-making fears, by category',
    sortOrder: 13,
    content: `List what Texas panel members worry about (e.g. victim/community safety, compliance, stability, honesty, escalation risk). The model should surface these fears implicitly and answer them with facts from the file—not dismiss them.

Where helpful, organize fears (and how the campaign responds) by category of concern or offense context—e.g. violent vs drug vs property vs DWI—so tone and emphasis shift appropriately while staying truthful to the record.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'narrative-by-offense-type',
    title: 'Narrative by offense type (tone, emphasis, and framing)',
    sortOrder: 14,
    content: `You must modulate the **entire** parole campaign narrative based on the **primary offense context** reflected in the assessment and support materials. Use only what those sources support—never invent charges, victims, legal outcomes, or severity.

**How to classify (inference rules)**
- Read offense-related fields and answers (e.g. offense_details, prior_offenses, remorse, programming, supervision context) and any support-letter references to the conduct. Choose the single **dominant** framing that best matches the described conduct.
- If multiple serious categories apply, synthesize: address the **highest-concern** category first for accountability and safety language, then incorporate secondary themes without minimizing the primary harm.
- If the text is genuinely ambiguous, use neutral, discipline-focused framing (accountability, stability, verifiable plan) and **do not** guess a specific offense label.

**Violent or person-oriented offenses** (assault, robbery with contact, domestic violence, etc. **as described in the file**)
- Lead with clear accountability for harm and fear; never shift blame to victims or circumstances.
- Emphasize insight, de-escalation, anger or emotion regulation, programming completed or ongoing, and **safety planning** (triggers, avoiding high-risk people/places) only when supported by facts.
- Tie concrete supervision, treatment, and family/support roles to stability and compliance.

**Sex-related offenses** (only if the assessment or letters support this category)
- Use dignified, non-graphic language; do not add detail beyond what the sources support.
- Emphasize treatment engagement, accountability, boundary-consistent living, and **condition-driven** compliance. Never minimize harm or privacy impact.

**Drug offenses** (possession, delivery, trafficking **as described**)
- Center criminogenic needs tied to the record: substance use history, treatment, relapse prevention, pro-social alternatives, employment and housing stability linked to recovery where facts allow.
- Avoid normalizing drug commerce; if distribution is evidenced, pair accountability with a credible lawful path forward.

**Property, theft, fraud, burglary without person injury** (**as described**)
- Stress accountability for loss and trust; reference restitution or amends-oriented thinking **only** if the assessment or letters mention it.
- Tie the plan to lawful income, structured environment, and reduced opportunity for repeat conduct—without fabricating programs or employers.

**DWI / intoxication-related** (vehicular or repeated impairment patterns **in the file**)
- Put public safety and impaired decision-making accountability first; align treatment or substance plan with stated facts.
- Address transportation and how obligations will be met after release **only** with assessment-supported detail—do not invent license status or vehicle arrangements.

**White-collar or fraud** (if the assessment indicates)
- Emphasize integrity, transparency with supervision, and a lawful employment path; avoid legal conclusions not evidenced in the file.

**Dated or youthful priors with emphasis on current stability**
- Acknowledge history briefly; stress verifiable present behavior (work, family, programming) **only** with supporting facts—do not erase the record.

**Ambiguous or "other" offense picture**
- Default to: clear accountability, no minimization, concrete reentry plan, and alignment with every PAROLE_STRUCTURE section—without labeling an offense type the file does not support.

Cross-cutting: All categories still require truthfulness, respect for victims and communities, a concrete plan, and obedience to each section's staff instructions.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'how-they-read-a-file',
    title: 'How they read a file',
    sortOrder: 15,
    content: `Skim order, what they look for first, what makes them stop reading, common drop-off points. Instruct the model to put the highest-signal facts early in each JSON section that maps to synopsis and letter.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'content-decision-implications',
    title: 'What this means for every content decision in the campaign',
    sortOrder: 16,
    content: `Every paragraph should either reduce perceived risk, increase perceived stability, or document verifiable progress. Cut filler. If a sentence does not serve one of those three, remove or rewrite.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'decision-willing-to-make',
    title: 'The decision they are willing to make',
    sortOrder: 17,
    content: `Clarify what "yes" looks like for a reviewer (e.g. manageable plan, credible supports, insight demonstrated). The model should not ask for trust without evidence.`,
  },
  {
    category: 'LLM_GUIDELINES',
    slug: 'must-never-do',
    title: 'What the campaign must never do',
    sortOrder: 18,
    content: `Never: fabricate credentials, minimize victims, attack the board, imply entitlement, promise sobriety or compliance without grounding, use political rhetoric, or include legal advice. Never instruct dishonesty.`,
  },
]
