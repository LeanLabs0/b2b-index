/**
 * B2BIndexCompany.tsx: B2Bindex company profile page wireframe (V3).
 *
 * COPY SOURCE: copy/B2BIndexCompany.md, copy_gate PASS (Kevin's live review
 * restructure: score parts jump to their own data sections, best part called
 * out, comparisons, index explainer, claim block). Every visible sentence comes
 * from that deck verbatim; the [src: ...] markers are deck annotation and do
 * not render. Numbers and data rows are data, not copy. Do not edit deck copy
 * here without re-gating the deck, and re-gate the rendered DOM after edits
 * (copy_gate.py --html).
 *
 * ONE page serves every company in the snapshot: /B2BIndexCompany?company=<slug>.
 * With no slug it renders the top of the ranking. Everything below reads from
 * _shared/b2bindexData.ts, which reads the generated snapshot.
 */
import {
  RSection,
  RContainer,
  RGrid,
  RCol,
  WireNavbar,
  WireHeading,
  WireText,
  WireCard,
  WireBadge,
  WireButton,
  WireFooter,
} from "./_shared/Wire";
import { b2bindex, compareHref, B2B_ARTICLE } from "./_shared/b2bindexSitemap";
import {
  b2bArticles,
  featuredCompany,
  featuredCompanyDetail,
  DATA_NOTE,
  NO_DATA,
  WORKED_CATEGORY,
  type DataRow,
  type IndexArticle,
  type IndexCompany,
  type PartDetail,
} from "./_shared/b2bindexData";
import { ScoreBox } from "./_shared/ScoreBox";

/** Same-page anchor target for the claim block. */
const CLAIM_ANCHOR = "#claim";

/** The three parts of the score, each jumping to its own data section. */
const PART_SECTIONS = [
  { part: "Reputation", value: featuredCompany.reputation, anchor: "reputation" },
  { part: "Culture", value: featuredCompany.culture, anchor: "culture" },
  { part: "Authority", value: featuredCompany.authority, anchor: "authority" },
];

/** Facts that only the company can confirm stay empty until it claims the profile. */
const UNCLAIMED = "Added when claimed";

const companyFacts: { label: string; value: string; unclaimed?: boolean }[] = [
  { label: "Website", value: featuredCompany.domain },
  { label: "Category", value: WORKED_CATEGORY },
  ...(featuredCompany.hq ? [{ label: "HQ", value: featuredCompany.hq }] : []),
  featuredCompany.founded
    ? { label: "Founded", value: featuredCompany.founded }
    : { label: "Founded", value: UNCLAIMED, unclaimed: true },
  { label: "Size", value: UNCLAIMED, unclaimed: true },
];

/** The nearest companies in the category, highest score first. */
const nearby: IndexCompany[] = featuredCompanyDetail.compareWith;

/** A part with no source carries its reason as the section note. */
const noteFor = (part: PartDetail): string | undefined =>
  part.value === null ? part.reason : undefined;

const claimBenefits = [
  {
    title: "Correct your information",
    body: "Facts you fix stay fixed, and the record credits the company as the source.",
  },
  {
    title: "See every mention",
    body: "Articles that name the company collect on the profile as we publish them.",
  },
  {
    title: "Request inclusion in upcoming features",
    body: "Claimed profiles go first when comparisons and category features ship.",
  },
];

/** One row of source data behind a part of the score. */
const SourceRow = ({ row }: { row: DataRow }) => (
  <div className="flex items-center justify-between gap-6 border-b border-gray-200 px-6 py-4 last:border-b-0">
    <span className="text-sm text-gray-500">{row.label}</span>
    <span className="flex items-baseline gap-3">
      <span className={row.muted ? "text-sm text-gray-400" : "text-sm font-medium text-gray-900"}>
        {row.value}
      </span>
      {row.meta && <span className="text-sm text-gray-400">{row.meta}</span>}
    </span>
  </div>
);

/** A part of the score: deck copy beside the data it is built from. */
const PartSection = ({
  id,
  title,
  description,
  rows,
  total,
  bg,
  note,
}: {
  id: string;
  title: string;
  description: string;
  rows: DataRow[];
  total: string;
  bg: "white" | "light";
  note?: string;
}) => (
  <RSection bg={bg} id={id}>
    <RContainer>
      <RGrid className="items-center">
        <RCol span={5} className="flex flex-col gap-4">
          <WireHeading level={2}>{title}</WireHeading>
          <WireText>{description}</WireText>
        </RCol>
        <RCol span={7}>
          <div className="border border-gray-200 bg-white">
            {rows.map((row) => (
              <SourceRow key={row.label} row={row} />
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">{total}</p>
          {note && <p className="mt-2 text-sm text-gray-400">{note}</p>}
        </RCol>
      </RGrid>
    </RContainer>
  </RSection>
);

/** Article row: title, date, category chip. */
const ArticleRow = ({ article, href }: { article: IndexArticle; href: string }) => (
  <a
    href={href}
    className="flex flex-col gap-3 border-b border-gray-200 py-6 last:border-b-0 md:flex-row md:items-center md:justify-between"
  >
    <span className="flex flex-1 flex-col gap-1">
      <span className="font-semibold text-gray-900">{article.title}</span>
      <span className="text-sm text-gray-500">{article.date}</span>
    </span>
    <WireBadge className="self-start">{article.category}</WireBadge>
  </a>
);

/** Profile header: logo box, name, category chip, one-liner, claim button. */
const ProfileHeader = () => (
  <RSection size="lg" bg="white">
    <RContainer>
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 items-start gap-6">
          <span className="flex size-20 shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-[10px] font-medium tracking-[0.2em] text-gray-400">
            LOGO
          </span>
          <div className="flex flex-col items-start gap-4">
            <WireHeading level={1}>{featuredCompany.name}</WireHeading>
            <WireBadge>{WORKED_CATEGORY}</WireBadge>
            <p className="text-gray-500">{featuredCompany.blurb}</p>
          </div>
        </div>
        <WireButton href={CLAIM_ANCHOR} className="self-start">
          Claim this profile
        </WireButton>
      </div>
    </RContainer>
  </RSection>
);

/** Score panel: the Index Score, its movement, and the parts as jump links. */
const ScorePanel = () => (
  <RSection bg="light">
    <RContainer>
      <RGrid className="items-center">
        <RCol span={5} className="flex flex-col gap-4">
          <WireHeading level={2}>Read the score</WireHeading>
          <WireText>
            The Index Score runs from 1 to 100. Click any part to jump to the data behind it.
          </WireText>
        </RCol>
        <RCol span={7}>
          <WireCard className="flex flex-col items-center gap-8 sm:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <ScoreBox value={featuredCompany.index} size="lg" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                {featuredCompany.delta !== null && (
                  <span aria-hidden="true" className="text-[9px] leading-none text-gray-500">
                    &#9650;
                  </span>
                )}
                {featuredCompanyDetail.delta}
              </span>
            </div>
            <div className="grid w-full grid-cols-3 gap-4">
              {PART_SECTIONS.map(({ part, value, anchor }) => (
                <a key={part} href={`#${anchor}`} className="flex flex-col items-center gap-3">
                  <span className="flex h-16 w-full flex-col items-center justify-center gap-0.5 border border-gray-200 bg-gray-50">
                    {value === null ? (
                      <span className="px-1 text-center text-[11px] leading-tight text-gray-500">
                        {NO_DATA}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-semibold leading-none text-gray-900">
                          {value}
                        </span>
                        <span className="text-[10px] leading-none text-gray-400">/100</span>
                      </>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{part}</span>
                </a>
              ))}
            </div>
          </WireCard>
          <p className="mt-4 text-sm text-gray-400">{DATA_NOTE}</p>
        </RCol>
      </RGrid>
    </RContainer>
  </RSection>
);

/** Company facts: deck copy beside the label/value table. */
const CompanyFacts = () => (
  <RSection bg="light">
    <RContainer>
      <RGrid className="items-center">
        <RCol span={5} className="flex flex-col gap-4">
          <WireHeading level={2}>Company facts</WireHeading>
          <WireText>
            Website, category, founding year and size fill from the verified record, and empty
            fields stay empty until the company claims the profile.
          </WireText>
        </RCol>
        <RCol span={7}>
          <div className="border border-gray-200 bg-white">
            {companyFacts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center justify-between gap-8 border-b border-gray-200 px-6 py-5 last:border-b-0"
              >
                <span className="text-sm text-gray-500">{fact.label}</span>
                <span
                  className={
                    fact.unclaimed ? "text-sm text-gray-400" : "text-sm font-medium text-gray-900"
                  }
                >
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </RCol>
      </RGrid>
    </RContainer>
  </RSection>
);

/** Mentions: deck copy plus the three published articles. */
const CompanyArticles = () => (
  <RSection bg="white">
    <RContainer>
      <RGrid>
        <RCol span={4} className="flex flex-col gap-4">
          <WireHeading level={2}>Articles mentioning this company</WireHeading>
          <WireText>
            Our coverage links every company it names, so mentions land on this page.
          </WireText>
        </RCol>
        <RCol span={8}>
          <div className="border-t border-gray-200">
            {b2bArticles.map((article) => (
              <ArticleRow key={article.title} article={article} href={B2B_ARTICLE} />
            ))}
          </div>
        </RCol>
      </RGrid>
    </RContainer>
  </RSection>
);

/** Comparison: this company anchored against its nearest neighbours. */
const CompareSection = () => (
  <RSection bg="light">
    <RContainer>
      <RGrid>
        <RCol span={4} className="flex flex-col gap-4">
          <WireHeading level={2}>Compare with similar companies</WireHeading>
          <WireText>
            The companies closest to this one in the category sit side by side, each with its own
            score.
          </WireText>
        </RCol>
        <RCol span={8}>
          <div className="border border-gray-200 bg-white">
            <div className="flex items-center gap-6 border-b border-gray-200 bg-gray-50 px-6 py-5">
              <span className="flex flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-gray-900">{featuredCompany.name}</span>
                  <WireBadge>This company</WireBadge>
                </span>
                <span className="text-sm text-gray-500">{featuredCompany.blurb}</span>
              </span>
              <ScoreBox value={featuredCompany.index} size="sm" strong />
            </div>
            {nearby.map((company) => (
              <a
                key={company.slug}
                href={compareHref(featuredCompany.slug, company.slug)}
                className="flex items-center gap-6 border-b border-gray-200 px-6 py-5 last:border-b-0"
              >
                <span className="flex flex-1 flex-col gap-1">
                  <span className="font-semibold text-gray-900">{company.name}</span>
                  <span className="text-sm text-gray-500">{company.blurb}</span>
                </span>
                <ScoreBox value={company.index} size="sm" />
              </a>
            ))}
          </div>
        </RCol>
      </RGrid>
    </RContainer>
  </RSection>
);

/** How the index works: one short explainer, centered in the measure. */
const HowItWorks = () => (
  <RSection bg="white" id="how-is-this-calculated">
    <RContainer className="max-w-3xl">
      <div className="flex flex-col items-center gap-4 text-center">
        <WireHeading level={2}>How the B2B Index works</WireHeading>
        <WireText>
          Every listed company gets the same three part score, and we recompute it on a rolling
          schedule so the ranking keeps up.
        </WireText>
      </div>
    </RContainer>
  </RSection>
);

/** Claim block: heading, status line, the three claim benefits, then the CTA. */
const ClaimBlock = () => (
  <RSection bg="light" id="claim">
    <RContainer>
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
        <WireHeading level={2}>Claim this profile</WireHeading>
        <WireText>Nobody has claimed this listing yet. Claiming is free.</WireText>
      </div>
      <RGrid>
        {claimBenefits.map((item) => (
          <RCol key={item.title} span={4}>
            <WireCard className="flex h-full flex-col gap-3">
              <WireHeading level={3}>{item.title}</WireHeading>
              <WireText className="text-sm">{item.body}</WireText>
            </WireCard>
          </RCol>
        ))}
      </RGrid>
      <div className="mt-12 flex justify-center">
        <WireButton>Claim this profile</WireButton>
      </div>
    </RContainer>
  </RSection>
);

export const B2BIndexCompany = () => (
  <div className="bg-white">
    <WireNavbar sitemap={b2bindex} />

    <ProfileHeader />

    <ScorePanel />

    <PartSection
      id="reputation"
      bg="white"
      title="See where the reviews come from"
      description="We pull ratings and review counts from the review platforms, and read how recent they are and how far they spread."
      rows={featuredCompanyDetail.reputation.rows}
      total={featuredCompanyDetail.reputation.total}
      note={noteFor(featuredCompanyDetail.reputation)}
    />

    <PartSection
      id="culture"
      bg="light"
      title="See how employees rate the company"
      description="Glassdoor and Indeed set this part of the score, and we refresh it every quarter."
      rows={featuredCompanyDetail.culture.rows}
      total={featuredCompanyDetail.culture.total}
      note={noteFor(featuredCompanyDetail.culture)}
    />

    <PartSection
      id="authority"
      bg="white"
      title="See how the domain performs"
      description="Domain authority sets this part, measured against the other companies indexed in the same category."
      rows={featuredCompanyDetail.authority.rows}
      total={featuredCompanyDetail.authority.total}
      note={noteFor(featuredCompanyDetail.authority)}
    />

    <CompanyFacts />

    <CompanyArticles />

    <CompareSection />

    <HowItWorks />

    <ClaimBlock />

    <WireFooter sitemap={b2bindex} newsletter={false} />
  </div>
);
