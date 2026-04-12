import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware'
import { db } from '@/lib/db'
import { resolveCampaignRouteId } from '@/lib/route-params'
import { sendCampaignPublishedClientEmail } from '@/lib/email'

export const GET = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: { userId: string },
    context?: { params?: { id?: string } | Promise<{ id?: string }> }
  ) => {
    try {
      const id = await resolveCampaignRouteId(req, context)
      if (!id) {
        return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
      }

      const campaign = await db.campaign.findFirst({
        where: { id },
        include: {
          case: {
            select: {
              id: true,
              userId: true,
              clientName: true,
              tdcjNumber: true,
            },
          },
        },
      })

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }

      let blueprint = null
      try {
        blueprint = JSON.parse(campaign.blueprintJson)
      } catch {
        // ignore
      }

      let narrative: unknown = null
      if (campaign.narrativeJson) {
        try {
          narrative = JSON.parse(campaign.narrativeJson)
        } catch {
          narrative = null
        }
      }

      return NextResponse.json({
        campaign: {
          id: campaign.id,
          version: campaign.version,
          language: campaign.language,
          status: campaign.status,
          reviewCycle: campaign.reviewCycle,
          createdAt: campaign.createdAt,
          renderedPdfUrl: campaign.renderedPdfUrl,
          publishedToClient: campaign.publishedToClient,
          caseId: campaign.caseId,
          clientName: campaign.case.clientName,
          tdcjNumber: campaign.case.tdcjNumber,
          blueprint,
          narrative,
        },
      })
    } catch (error) {
      console.error('Error fetching campaign (admin):', error)
      return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
    }
  }
)

export const PATCH = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: { userId: string },
    context?: { params?: { id?: string } | Promise<{ id?: string }> }
  ) => {
    try {
      const id = await resolveCampaignRouteId(req, context)
      if (!id) {
        return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
      }

      const body = await req.json().catch(() => ({}))
      const { publishedToClient } = body as { publishedToClient?: boolean }

      if (typeof publishedToClient !== 'boolean') {
        return NextResponse.json(
          { error: 'publishedToClient (boolean) required' },
          { status: 400 }
        )
      }

      const existing = await db.campaign.findFirst({
        where: { id },
        include: {
          case: {
            include: {
              user: { select: { email: true, name: true } },
            },
          },
        },
      })
      if (!existing) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }

      const wasPublished = existing.publishedToClient

      await db.campaign.update({
        where: { id },
        data: { publishedToClient },
      })

      if (publishedToClient && !wasPublished && existing.case.user?.email) {
        const origin = req.nextUrl.origin
        sendCampaignPublishedClientEmail({
          to: existing.case.user.email,
          name: existing.case.user.name,
          clientName: existing.case.clientName,
          origin,
        }).catch((err) =>
          console.error('Campaign published client email failed:', err)
        )
      }

      return NextResponse.json({ success: true, publishedToClient })
    } catch (error) {
      console.error('Error updating campaign (admin):', error)
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }
  }
)

export const DELETE = requireRole(['ADMIN', 'STAFF'])(
  async (
    req: NextRequest,
    _user: { userId: string },
    context?: { params?: { id?: string } | Promise<{ id?: string }> }
  ) => {
    try {
      const id = await resolveCampaignRouteId(req, context)
      if (!id) {
        return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
      }

      const existing = await db.campaign.findFirst({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }

      await db.campaign.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting campaign (admin):', error)
      return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
    }
  }
)
