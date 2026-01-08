import { openai, DEFAULT_MODEL, type CampaignBlueprint } from './openai'
import { CAMPAIGN_BLUEPRINT_PROMPT } from './prompts'

export async function generateCampaignBlueprint(
  assessmentData: any,
  documents: any[],
  caseData: any
): Promise<CampaignBlueprint> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.')
  }

  const prompt = CAMPAIGN_BLUEPRINT_PROMPT(assessmentData, documents)

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert parole campaign writer. Generate a structured Campaign Blueprint as JSON. Follow the exact schema provided.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  try {
    const blueprint = JSON.parse(content) as CampaignBlueprint
    return blueprint
  } catch (error) {
    console.error('Failed to parse blueprint:', error)
    throw new Error('Invalid blueprint format from AI')
  }
}

export async function improveSection(
  sectionName: string,
  currentContent: string,
  concerns: string[]
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.')
  }

  const { SECTION_IMPROVEMENT_PROMPT } = await import('./prompts')
  const prompt = SECTION_IMPROVEMENT_PROMPT(sectionName, currentContent, concerns)

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert parole campaign editor. Improve the provided section while maintaining truthfulness and accuracy.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content || currentContent
}
