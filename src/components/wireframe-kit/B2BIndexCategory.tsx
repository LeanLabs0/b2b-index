/**
 * B2BIndexCategory.tsx: B2Bindex category ranking page wireframe.
 *
 * COPY SOURCE: copy/B2BIndexCategory.md, copy_gate PASS 2026-08-20
 * (passes/2026-08-20-b2bindex-wireframe-decks.md). Every visible sentence comes
 * from that deck verbatim; the [src: ...] markers are deck annotation and do not
 * render. Do not edit copy here without re-gating the deck, and re-gate the
 * rendered DOM after edits (copy_gate.py --html).
 *
 * Names and numbers come from _shared/b2bindexData.ts, which reads the generated
 * snapshot. The page says when it was updated once, under the ranking board.
 */
import {
  RSection,
  RContainer,
  RGrid,
  RCol,
  WireNavbar,
  WireHeading,
  WireText,
  WireBadge,
  WireLayout,
  WireCta,
  WireFooter,
} from "./_shared/Wire";
import {
  b2bindex,
  companyHref,
  B2B_ARTICLE,
  B2B_COMPANY,
  B2B_HOME,
} from "./_shared/b2bindexSitemap";
import {
  b2bArticles,
  DATA_NOTE,
  workedCategoryRanking,
  WORKED_CATEGORY,
  type IndexArticle,
} from "./_shared/b2bindexData";
import { BoardHeader, RankingRow } from "./_shared/RankingBoard";

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

/** Page header: breadcrumb line, deck H1, deck subhead. */
const CategoryHeader = () => (
  <RSection size="lg" bg="white">
    <RContainer>
      <div className="flex max-w-3xl flex-col gap-6">
        <p className="text-sm text-gray-500">
          <a href={B2B_HOME}>Home</a> / Categories / {WORKED_CATEGORY}
        </p>
        <WireHeading level={1}>Top {WORKED_CATEGORY} companies</WireHeading>
        <WireText>
          Compare the leaders in one place. Every company below carries an Index Score built from
          reviews, employee ratings, and domain authority.
        </WireText>
      </div>
    </RContainer>
  </RSection>
);

/** Sort control: the board reorders by the Index Score or by any part of it. */
const SortBar = () => (
  <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
    <span className="mr-1 text-gray-500">Sort by</span>
    {["Index Score", "Reputation", "Culture", "Authority"].map((label, i) => (
      <span
        key={label}
        className={
          i === 0
            ? "border border-gray-900 bg-gray-900 px-3 py-1 text-xs font-medium text-white"
            : "border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600"
        }
      >
        {label}
      </span>
    ))}
  </div>
);

/** The ranking board, with the deck's scoring note underneath. */
const RankingBoard = () => (
  <RSection bg="light">
    <RContainer>
      <div className="mb-10">
        <WireHeading level={2}>See the ranking</WireHeading>
      </div>
      <SortBar />
      <div className="border border-gray-200 bg-white">
        <BoardHeader />
        {workedCategoryRanking.map((company) => (
          <RankingRow
            key={company.slug}
            company={company}
            claim
            href={companyHref(company.slug)}
          />
        ))}
      </div>
      <WireText className="mt-6 text-sm">
        Scores are whole numbers from 1 to 100. Click any score for the math, or sort the board by
        the Index Score and by each part behind it.
      </WireText>
      <p className="mt-2 text-sm text-gray-400">{DATA_NOTE}</p>
    </RContainer>
  </RSection>
);

/** Category coverage: deck copy plus the three published articles. */
const CategoryArticles = () => (
  <RSection bg="white">
    <RContainer>
      <RGrid>
        <RCol span={4} className="flex flex-col gap-4">
          <WireHeading level={2}>Read the articles behind this category</WireHeading>
          <WireText>
            Our coverage names the companies in this ranking, and every name links back to its
            profile.
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

export const B2BIndexCategory = () => (
  <div className="bg-white">
    <WireNavbar sitemap={b2bindex} />

    <CategoryHeader />

    <RankingBoard />

    <WireLayout
      split="3-col"
      tagline=""
      title="Check how this ranking works"
      description="The Index Score averages three parts, each pulled from sources we can check again next month."
      buttons={0}
      bg="white"
      cards={[
        {
          title: "Reputation",
          body: "How customers rate the company across review platforms, weighted by how recent those ratings are and how many platforms carry them.",
        },
        {
          title: "Culture",
          body: "How employees rate the company on Glassdoor and Indeed, refreshed every quarter.",
        },
        {
          title: "Authority",
          body: "How the company's domain performs against the others indexed in the same category.",
        },
      ]}
    />

    <CategoryArticles />

    <WireCta
      title="Missing from this list?"
      description="Request a listing and we build your profile from public records, then score it on the same math as everyone else."
      primaryLabel="Request a listing"
      primaryHref={B2B_COMPANY}
      secondaryLabel={null}
      bg="light"
    />

    <WireFooter sitemap={b2bindex} newsletter={false} />
  </div>
);
