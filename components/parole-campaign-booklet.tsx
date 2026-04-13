"use client"

import type { CampaignBlueprint } from "@/lib/ai/openai"
import "./parole-campaign-booklet.css"

export type BookletDocument = {
  id: string
  type: string
  fileName: string
  mimeType: string
}

function isImageMime(mime: string) {
  return /^image\//i.test(mime || "")
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const DOC_LABEL: Record<string, string> = {
  SUPPORT_LETTER: "Letter of support",
  PHOTO: "Photo",
  CERTIFICATE: "Certificate / program completion",
  EMPLOYMENT_PLAN: "Employment plan",
  HOUSING_PLAN: "Housing plan",
  OTHER: "Supporting document",
}

type Props = {
  blueprint: CampaignBlueprint
  clientName: string
  tdcjNumber: string
  documents: BookletDocument[]
  documentHref: (id: string) => string
  backHref: string
  /** e.g. "← Parole campaign" so "Back" is not ambiguous */
  backLabel?: string
  /** Optional second link (e.g. main dashboard when backHref is a sub-page). */
  dashboardHref?: string
  dashboardLabel?: string
  toolbarTitle?: string
}

export function ParoleCampaignBooklet({
  blueprint,
  clientName,
  tdcjNumber,
  documents,
  documentHref,
  backHref,
  backLabel = "← Back",
  dashboardHref,
  dashboardLabel = "Dashboard",
  toolbarTitle = "Parole campaign booklet",
}: Props) {
  const b = blueprint
  const s = b.sections
  const displayName = b.case_summary?.client_name?.trim() || clientName
  const displayTdcj = b.case_summary?.tdcj_number?.trim() || tdcjNumber

  const photos = documents.filter((d) => d.type === "PHOTO" && isImageMime(d.mimeType))
  const supportScans = documents.filter((d) => d.type === "SUPPORT_LETTER")
  const certificates = documents.filter((d) => d.type === "CERTIFICATE")
  const employmentDocs = documents.filter((d) => d.type === "EMPLOYMENT_PLAN")
  const housingDocs = documents.filter((d) => d.type === "HOUSING_PLAN")
  const otherDocs = documents.filter((d) => d.type === "OTHER")

  const coverPhoto = photos[0]
  const photoGallery = coverPhoto ? photos.slice(1) : photos
  const photoChunks = chunk(photoGallery, 4)

  const tocItems = [
    { label: "Case overview & executive summary", num: "03" },
    { label: "Panel concerns & response", num: "04" },
    { label: "Letter to the Parole Board", num: "05" },
    { label: "Strengths & accountability", num: "06" },
    { label: "Reentry plan: 30 / 90 / 180 days", num: "07" },
    { label: "Home plan", num: "08" },
    { label: "Transportation", num: "09" },
    { label: "Employment", num: "10" },
    { label: "Future goals & commitments", num: "11" },
    ...(s.treatment_plan ? [{ label: "Treatment & programming", num: "12" }] : []),
    { label: "Letters of support (summaries)", num: s.treatment_plan ? "13" : "12" },
    { label: "Closing", num: s.treatment_plan ? "14" : "13" },
    { label: "Life in photos", num: s.treatment_plan ? "15" : "14" },
    { label: "Supporting documents (uploaded)", num: "…" },
  ]

  return (
    <div className="parole-booklet">
      <div className="parole-booklet__toolbar no-print">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a href={backHref}>{backLabel}</a>
          {dashboardHref ? (
            <>
              <span className="opacity-50" aria-hidden>
                ·
              </span>
              <a href={dashboardHref}>{dashboardLabel}</a>
            </>
          ) : null}
          <span className="hidden sm:inline opacity-40" aria-hidden>
            ·
          </span>
          <span>{toolbarTitle}</span>
        </div>
        <button
          type="button"
          className="rounded-md bg-amber-100/15 px-3 py-1.5 text-sm font-semibold text-amber-100 hover:bg-amber-100/25"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="parole-booklet__stack">
        {/* 01 Cover */}
        <section className="parole-booklet__page parole-booklet__page--cover">
          {coverPhoto ? (
            <img
              className="parole-booklet__cover-photo"
              src={documentHref(coverPhoto.id)}
              alt=""
            />
          ) : null}
          <div className="parole-booklet__cover-band">
            <p className="parole-booklet__cover-kicker">Parole campaign</p>
            <h1 className="parole-booklet__cover-title">{displayName}</h1>
            <p className="parole-booklet__cover-sub">{s.cover?.tagline || "Present your plan, not your past."}</p>
            <div className="parole-booklet__cover-meta">
              <strong>TDCJ #{displayTdcj}</strong>
            </div>
          </div>
          <div className="parole-booklet__cover-footer">Parolegy · Prepared for review</div>
        </section>

        {/* 02 Contents */}
        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Table of contents</div>
          <ul className="parole-booklet__toc">
            {tocItems.map((item) => (
              <li key={item.label}>
                <span className="parole-booklet__toc-label">{item.label}</span>
                <span className="parole-booklet__toc-num">{item.num}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part I — Case overview</h2>
            <p>Executive summary and how this file addresses likely panel concerns.</p>
          </div>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Executive summary</div>
          <h2 className="parole-booklet__h2">{s.synopsis?.title || "Executive summary"}</h2>
          {b.case_summary?.key_facts?.length ? (
            <>
              <p className="parole-booklet__h3">Key facts</p>
              {b.case_summary.key_facts.map((fact, i) => (
                <div key={i} className="parole-booklet__fact">
                  <span className="parole-booklet__fact-mark">▸</span>
                  <span>{fact}</span>
                </div>
              ))}
            </>
          ) : null}
          {s.synopsis?.paragraphs?.map((p, i) => (
            <p key={i} className="parole-booklet__p">
              {p}
            </p>
          ))}
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Panel concerns &amp; response</div>
          <p className="parole-booklet__p text-sm text-[var(--book-muted)] mb-2">
            Likely questions from the panel, the facts of the case, and how they are addressed in this
            campaign.
          </p>
          {b.panel_concerns?.map((row, i) => (
            <div key={i} className="parole-booklet__concern">
              <strong>Concern</strong>
              <p className="parole-booklet__p mb-1">{row.concern}</p>
              <strong>Evidence</strong>
              <p className="parole-booklet__p mb-1">{row.evidence}</p>
              <strong>Response</strong>
              <p className="parole-booklet__p mb-0">{row.mitigation}</p>
            </div>
          ))}
          {b.narrative_strategy?.themes?.length ? (
            <>
              <p className="parole-booklet__h3">Narrative themes</p>
              <ul className="parole-booklet__list">
                {b.narrative_strategy.themes.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              {b.narrative_strategy.tone ? (
                <p className="parole-booklet__p text-sm">
                  <strong>Tone:</strong> {b.narrative_strategy.tone}
                </p>
              ) : null}
            </>
          ) : null}
        </section>

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part II — Voice of the applicant</h2>
            <p>Direct letter, strengths, and accountability.</p>
          </div>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Letter to the Texas Board of Pardons and Paroles</div>
          <p className="parole-booklet__p font-medium">{s.client_letter?.salutation}</p>
          {s.client_letter?.paragraphs?.map((p, i) => (
            <p key={i} className="parole-booklet__p">
              {p}
            </p>
          ))}
          <p className="parole-booklet__p mt-4">{s.client_letter?.closing}</p>
          <p className="parole-booklet__p">{displayName}</p>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Strengths &amp; rehabilitation</div>
          <ul className="parole-booklet__list">
            {s.strengths?.bullets?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part III — Reentry plan</h2>
            <p>Concrete steps for the first six months and beyond.</p>
          </div>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">30 / 90 / 180-day plan</div>
          <div className="parole-booklet__grid-3">
            <div className="parole-booklet__plan-col">
              <h4>First 30 days</h4>
              <ul className="parole-booklet__list">
                {s.plan_30_90_180?.plan_30?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="parole-booklet__plan-col">
              <h4>Days 31–90</h4>
              <ul className="parole-booklet__list">
                {s.plan_30_90_180?.plan_90?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="parole-booklet__plan-col">
              <h4>Days 91–180</h4>
              <ul className="parole-booklet__list">
                {s.plan_30_90_180?.plan_180?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Home plan</div>
          {s.home_plan?.address ? (
            <p className="parole-booklet__p">
              <strong>Address / arrangement:</strong> {s.home_plan.address}
            </p>
          ) : null}
          <p className="parole-booklet__p">{s.home_plan?.description}</p>
          <ul className="parole-booklet__list">
            {s.home_plan?.stability_factors?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Transportation</div>
          <p className="parole-booklet__p">{s.transportation?.description}</p>
          <ul className="parole-booklet__list">
            {s.transportation?.details?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Employment</div>
          {s.employment?.history?.length ? (
            <>
              <p className="parole-booklet__h3">History &amp; skills</p>
              <ul className="parole-booklet__list">
                {s.employment.history.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </>
          ) : null}
          {s.employment?.opportunities?.length ? (
            <>
              <p className="parole-booklet__h3">Opportunities</p>
              <ul className="parole-booklet__list">
                {s.employment.opportunities.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </>
          ) : null}
          {s.employment?.plan?.length ? (
            <>
              <p className="parole-booklet__h3">Plan after release</p>
              <ul className="parole-booklet__list">
                {s.employment.plan.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Future goals &amp; commitments</div>
          <p className="parole-booklet__h3">Goals</p>
          <ul className="parole-booklet__list">
            {s.future?.goals?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <p className="parole-booklet__h3">Commitments</p>
          <ul className="parole-booklet__list">
            {s.future?.commitments?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        {s.treatment_plan ? (
          <section className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">Treatment &amp; programming</div>
            <p className="parole-booklet__p">{s.treatment_plan.description}</p>
            <ul className="parole-booklet__list">
              {s.treatment_plan.commitments?.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part IV — Support network</h2>
            <p>Summaries aligned with uploaded letters where available.</p>
          </div>
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Letters of support (summaries)</div>
          {s.support_letters?.supporters?.map((sup, i) => (
            <div key={i} className="parole-booklet__supporter">
              <p className="font-semibold">
                {sup.name}
                {sup.relationship ? ` · ${sup.relationship}` : ""}
              </p>
              <p className="parole-booklet__p mb-0">{sup.summary}</p>
            </div>
          ))}
        </section>

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Closing</div>
          {s.closing?.paragraphs?.map((p, i) => (
            <p key={i} className="parole-booklet__p">
              {p}
            </p>
          ))}
        </section>

        {b.citations_to_user_uploads?.length ? (
          <section className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">References to uploaded materials</div>
            <ul className="parole-booklet__list text-sm">
              {b.citations_to_user_uploads.map((c, i) => (
                <li key={i}>
                  <strong>{c.section}:</strong> {c.doc_id} — {c.reason}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part V — Life in photos</h2>
            <p>Images provided by the applicant (family, programs, milestones).</p>
          </div>
        </section>

        {photoChunks.length === 0 && !coverPhoto ? (
          <section className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">Photo gallery</div>
            <p className="parole-booklet__p text-muted-foreground">No photos uploaded for this campaign.</p>
          </section>
        ) : null}

        {photoChunks.map((group, pi) => (
          <section key={pi} className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">Photo gallery {pi + 1}</div>
            <div className="parole-booklet__photo-grid">
              {group.map((doc) => (
                <figure key={doc.id}>
                  <img src={documentHref(doc.id)} alt={doc.fileName} />
                  <figcaption className="text-xs text-center mt-1 text-[var(--book-muted)]">
                    {doc.fileName}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}

        <section className="parole-booklet__page parole-booklet__page--divider parole-booklet__divider-page">
          <div>
            <h2>Part VI — Supporting documents</h2>
            <p>Uploaded letters, certificates, and plans (as submitted).</p>
          </div>
        </section>

        {supportScans.map((doc) => (
          <section key={doc.id} className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">{DOC_LABEL.SUPPORT_LETTER}</div>
            <p className="text-sm font-medium">{doc.fileName}</p>
            {isImageMime(doc.mimeType) ? (
              <img
                className="parole-booklet__letter-img"
                src={documentHref(doc.id)}
                alt={doc.fileName}
              />
            ) : (
              <div className="parole-booklet__doc-card mt-2">
                <p className="mb-2">This file is not a browser-preview image (e.g. PDF). Open the original:</p>
                <a href={documentHref(doc.id)} target="_blank" rel="noopener noreferrer">
                  View / download — {doc.fileName}
                </a>
              </div>
            )}
          </section>
        ))}

        {[...certificates, ...employmentDocs, ...housingDocs, ...otherDocs].map((doc) => (
          <section key={doc.id} className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">{DOC_LABEL[doc.type] || doc.type}</div>
            <p className="text-sm font-medium mb-2">{doc.fileName}</p>
            {isImageMime(doc.mimeType) ? (
              <img
                className="parole-booklet__letter-img"
                src={documentHref(doc.id)}
                alt={doc.fileName}
              />
            ) : (
              <div className="parole-booklet__doc-card">
                <a href={documentHref(doc.id)} target="_blank" rel="noopener noreferrer">
                  View / download — {doc.fileName}
                </a>
              </div>
            )}
          </section>
        ))}

        {supportScans.length === 0 &&
        certificates.length === 0 &&
        employmentDocs.length === 0 &&
        housingDocs.length === 0 &&
        otherDocs.length === 0 ? (
          <section className="parole-booklet__page parole-booklet__page--section">
            <div className="parole-booklet__band">Supporting documents</div>
            <p className="parole-booklet__p text-muted-foreground">
              No additional supporting documents uploaded beyond photos.
            </p>
          </section>
        ) : null}

        <section className="parole-booklet__page parole-booklet__page--section">
          <div className="parole-booklet__band">Compliance note</div>
          <p className="parole-booklet__p text-sm">
            This booklet was generated from the applicant&apos;s assessment answers and uploaded
            materials. Content is presented in good faith for panel review; verify facts against official
            records.
          </p>
          {b.compliance_checks?.missing_info?.length ? (
            <>
              <p className="parole-booklet__h3">Information gaps noted</p>
              <ul className="parole-booklet__list text-sm">
                {b.compliance_checks.missing_info.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}
