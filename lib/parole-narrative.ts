export type ParoleNarrativeSection = {
  slug: string
  title: string
  content: string
}

export type ParoleCampaignNarrative = {
  sections: ParoleNarrativeSection[]
}
