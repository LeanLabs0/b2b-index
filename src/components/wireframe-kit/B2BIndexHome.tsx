/**
 * B2BIndexHome.tsx: B2Bindex home page wireframe.
 *
 * COPY SOURCE: copy/B2BIndexHome.md, copy_gate PASS 2026-08-20
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
  WireHeader,
  WireHeading,
  WireText,
  WireCard,
  WireBadge,
  WireLayout,
  WireCta,
  WireFooter,
} from "./_shared/Wire";
import {
  b2bindex,
  companyHref,
  B2B_ARTICLE,
  B2B_CATEGORY,
  B2B_COMPANY,
} from "./_shared/b2bindexSitemap";
import {
  b2bArticles,
  categories,
  DATA_NOTE,
  workedCategoryRanking,
  type IndexArticle,
  type IndexCategory,
} from "./_shared/b2bindexData";
import { BoardHeader, RankingRow } from "./_shared/RankingBoard";

/** Article card: title, date, category chip. */
const ArticleCard = ({ article, href }: { article: IndexArticle; href: string }) => (
  <a href={href} className="block h-full">
    <WireCard className="flex h-full flex-col gap-4">
      <p className="font-semibold text-gray-900">{article.title}</p>
      <p className="text-sm text-gray-500">{article.date}</p>
      <WireBadge className="mt-auto self-start">{article.category}</WireBadge>
    </WireCard>
  </a>
);

/** One category card. Only the worked category has a ranking behind it. */
const CategoryCard = ({ category }: { category: IndexCategory }) => {
  const card = (
    <WireCard className="flex h-full flex-col gap-2 p-5">
      <p className="font-semibold text-gray-900">{category.name}</p>
      <p className="text-sm text-gray-500">{category.count} companies</p>
      {category.live && (
        <WireBadge className="mt-2 self-start">Live index</WireBadge>
      )}
    </WireCard>
  );
  return category.live ? (
    <a href={B2B_CATEGORY} className="block h-full">
      {card}
    </a>
  ) : (
    card
  );
};

/** Browse by category: the full 32-category taxonomy. */
const BrowseCategories = () => (
  <RSection bg="light">
    <RContainer>
      <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
        <WireHeading level={2}>Browse by category</WireHeading>
        <WireText>
          Every company here starts from a verified record. Pick a category to see who leads it.
        </WireText>
      </div>
      <RGrid className="gap-y-6">
        {categories.map((category) => (
          <RCol key={category.name} span={3}>
            <CategoryCard category={category} />
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

/** Ranking preview: deck copy plus the top three of the worked category. */
const LeadersSection = () => (
  <RSection bg="white">
    <RContainer>
      <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
        <WireHeading level={2}>See who leads each category</WireHeading>
        <WireText>
          Open a category and read the ranking. Each company shows one Index Score, a whole number
          from 1 to 100.
        </WireText>
      </div>
      <div className="border border-gray-200 bg-white">
        <BoardHeader />
        {workedCategoryRanking.slice(0, 3).map((company) => (
          <RankingRow key={company.slug} company={company} href={companyHref(company.slug)} />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-400">{DATA_NOTE}</p>
    </RContainer>
  </RSection>
);

/** Coverage: deck copy plus the three published articles. */
const CoverageSection = () => (
  <RSection bg="white">
    <RContainer>
      <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
        <WireHeading level={2}>Read the coverage</WireHeading>
        <WireText>
          We publish articles on B2B trends, B2B data, and the companies behind both. When an
          article names a company, the name links to its profile.
        </WireText>
      </div>
      <RGrid>
        {b2bArticles.map((article) => (
          <RCol key={article.title} span={4}>
            <ArticleCard article={article} href={B2B_ARTICLE} />
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

export const B2BIndexHome = () => (
  <div className="bg-white">
    <WireNavbar sitemap={b2bindex} />

    <WireHeader
      split="6-6"
      title="Find the top B2B companies in every category"
      subtitle="Browse 32 B2B categories, see who leads each one, and check the score behind every rank."
      buttons={2}
      buttonLabels={["Browse categories", "Claim your brand"]}
      buttonLinks={[B2B_CATEGORY, B2B_COMPANY]}
      imageLabel="RANKING PREVIEW"
    />

    <BrowseCategories />

    <LeadersSection />

    <WireLayout
      split="3-col"
      tagline=""
      title="Check the math behind any score"
      description="Click a score to see how we calculated it. The Index Score averages three parts."
      buttons={0}
      bg="light"
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

    <CoverageSection />

    <WireCta
      title="Claim your brand"
      description="Correct your facts, connect your review profiles, and keep your listing current at no cost."
      primaryLabel="Claim your brand"
      primaryHref={B2B_COMPANY}
      secondaryLabel={null}
      bg="light"
    />

    <WireFooter sitemap={b2bindex} newsletter={false} />
  </div>
);
