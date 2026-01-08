import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import type { CampaignBlueprint } from '@/lib/ai/openai'

// Register fonts (you'll need to add font files)
// Font.register({
//   family: 'LibreBaskerville',
//   src: '/fonts/LibreBaskerville-Regular.ttf',
// })

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  cover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  coverSubtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: '#666',
  },
  coverInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: 'Helvetica-Bold',
    borderBottom: '2 solid #000',
    paddingBottom: 5,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
  },
  bullet: {
    marginBottom: 8,
    paddingLeft: 15,
  },
  bulletPoint: {
    marginLeft: -15,
    marginRight: 5,
  },
  quote: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderLeft: '4 solid #000',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#666',
  },
})

interface CampaignPDFProps {
  blueprint: CampaignBlueprint
  clientName: string
  tdcjNumber: string
}

export function CampaignPDF({ blueprint, clientName, tdcjNumber }: CampaignPDFProps) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.coverTitle}>Parole Campaign</Text>
          <Text style={styles.coverSubtitle}>{blueprint.sections.cover.tagline}</Text>
          <Text style={styles.coverInfo}>
            {clientName}
          </Text>
          <Text style={styles.coverInfo}>
            TDCJ #{tdcjNumber}
          </Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Table of Contents */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table of Contents</Text>
          {blueprint.sections.toc.map((item, index) => (
            <Text key={index} style={styles.paragraph}>
              {index + 1}. {item}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Campaign Synopsis */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{blueprint.sections.synopsis.title}</Text>
          {blueprint.sections.synopsis.paragraphs.map((para, index) => (
            <Text key={index} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Client Letter */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letter to the Parole Board</Text>
          <Text style={styles.paragraph}>{blueprint.sections.client_letter.salutation}</Text>
          {blueprint.sections.client_letter.paragraphs.map((para, index) => (
            <Text key={index} style={styles.paragraph}>
              {para}
            </Text>
          ))}
          <Text style={styles.paragraph}>{blueprint.sections.client_letter.closing}</Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Strengths */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Things You Should Know</Text>
          {blueprint.sections.strengths.bullets.map((bullet, index) => (
            <Text key={index} style={styles.bullet}>
              • {bullet}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* 30/90/180 Day Plan */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reentry Plan: 30 | 90 | 180 Days</Text>
          <Text style={styles.heading}>First 30 Days</Text>
          {blueprint.sections.plan_30_90_180.plan_30.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.heading}>Days 31-90</Text>
          {blueprint.sections.plan_30_90_180.plan_90.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.heading}>Days 91-180</Text>
          {blueprint.sections.plan_30_90_180.plan_180.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Home Plan */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home Plan</Text>
          <Text style={styles.paragraph}>{blueprint.sections.home_plan.description}</Text>
          {blueprint.sections.home_plan.stability_factors.map((factor, index) => (
            <Text key={index} style={styles.bullet}>
              • {factor}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Transportation */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transportation Plan</Text>
          <Text style={styles.paragraph}>{blueprint.sections.transportation.description}</Text>
          {blueprint.sections.transportation.details.map((detail, index) => (
            <Text key={index} style={styles.bullet}>
              • {detail}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Employment */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment History & Opportunities</Text>
          <Text style={styles.heading}>Employment History</Text>
          {blueprint.sections.employment.history.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.heading}>Employment Opportunities</Text>
          {blueprint.sections.employment.opportunities.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.heading}>Employment Plan</Text>
          {blueprint.sections.employment.plan.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Future Plans */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Future Plans</Text>
          <Text style={styles.heading}>Goals</Text>
          {blueprint.sections.future.goals.map((goal, index) => (
            <Text key={index} style={styles.bullet}>
              • {goal}
            </Text>
          ))}
          <Text style={styles.heading}>Commitments</Text>
          {blueprint.sections.future.commitments.map((commitment, index) => (
            <Text key={index} style={styles.bullet}>
              • {commitment}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Support Letters */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letters of Support</Text>
          {blueprint.sections.support_letters.supporters.map((supporter, index) => (
            <View key={index} style={styles.paragraph}>
              <Text style={styles.heading}>
                {supporter.name} - {supporter.relationship}
              </Text>
              <Text style={styles.paragraph}>{supporter.summary}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* Treatment Plan (if applicable) */}
      {blueprint.sections.treatment_plan && (
        <Page size="LETTER" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Post-Release Treatment Plan</Text>
            <Text style={styles.paragraph}>{blueprint.sections.treatment_plan.description}</Text>
            {blueprint.sections.treatment_plan.commitments.map((commitment, index) => (
              <Text key={index} style={styles.bullet}>
                • {commitment}
              </Text>
            ))}
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
        </Page>
      )}

      {/* Closing */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Closing</Text>
          {blueprint.sections.closing.paragraphs.map((para, index) => (
            <Text key={index} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>
    </Document>
  )
}
