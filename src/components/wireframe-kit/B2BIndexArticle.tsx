/**
 * B2BIndexArticle.tsx: B2Bindex article page wireframe (V2).
 *
 * COPY SOURCE: copy/B2BIndexArticle.md, copy_gate PASS (FAIL 0). Every visible
 * sentence comes from that deck verbatim; the [src: ...] markers are deck
 * annotation and do not render. Numbers, scores, tags and the meta row are
 * data, not copy. Do not edit deck copy here without re-gating the deck, and
 * re-gate the rendered DOM after edits (copy_gate.py --html).
 *
 * Structure follows a real WhatIsBest comparison article: breadcrumb, dek,
 * meta row with no named byline, summary box, takeaways, jump list, body
 * sections with a mid-article comparison table, the ranking, the method, a
 * bottom-line box, tags, and related coverage. No closing CTA.
 *
 * Every sentence that names a company or counts one comes from articleLines()
 * below, which fills the deck's templates from the generated snapshot. The two
 * pure-prose sections carry no names and stay verbatim.
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
  WireFooter,
} from "./_shared/Wire";
import { b2bindex, companyHref, B2B_ARTICLE, B2B_HOME } from "./_shared/b2bindexSitemap";
import {
  b2bArticles,
  DATA_NOTE,
  NO_DATA,
  workedCategoryRanking,
  type IndexArticle,
  type IndexCompany,
} from "./_shared/b2bindexData";
import { ScoreChip } from "./_shared/ScoreBox";

const TITLE = "The best B2B marketing companies for SaaS teams";
const META = "Roundup · 8 min · Updated Aug 2026";

/** Highest scorer on one part, skipping the companies with no source for it. */
const leaderOn = (
  ranking: IndexCompany[],
  part: "reputation" | "authority",
): IndexCompany | undefined =>
  ranking
    .filter((company) => company[part] !== null)
    .sort((a, b) => (b[part] as number) - (a[part] as number))[0];

/**
 * Every company-naming sentence in this article, filled from the ranking.
 * The deck holds the same sentences in template form.
 */
const articleLines = (ranking: IndexCompany[]) => {
  const total = ranking.length;
  const indexLeader = ranking[0];
  const reputationLeader = leaderOn(ranking, "reputation") ?? indexLeader;
  const authorityLeader = leaderOn(ranking, "authority") ?? indexLeader;
  const unrated = ranking.filter((company) => company.culture === null).length;
  const split = reputationLeader.slug !== authorityLeader.slug;

  const takeaways = [
    `${indexLeader.name} ranks first on the Index Score at ${indexLeader.index}.`,
    `${authorityLeader.name} holds the strongest domain authority in this category at ${authorityLeader.authority}.`,
    `${reputationLeader.name} leads on customer reviews at ${reputationLeader.reputation}.`,
  ];
  if (unrated > 0) {
    takeaways.push(
      `${unrated} of the ${total} carry no employee ratings yet, which holds their scores down.`,
    );
  }
  takeaways.push(
    "Every company here is scored on the same three parts, so the ranking moves when the underlying data moves.",
  );

  /** The mid-article table lines up the two the prose names. */
  const leaders: IndexCompany[] = [reputationLeader];
  if (split) leaders.push(authorityLeader);
  for (const company of ranking) {
    if (leaders.length >= 2) break;
    if (!leaders.some((entry) => entry.slug === company.slug)) leaders.push(company);
  }

  return {
    dek: `${total} agencies serve SaaS teams well, and the seat count you are hiring for decides which one fits.`,
    summary: split
      ? `${reputationLeader.name} leads this list on customer reviews, while ${authorityLeader.name} carries the strongest domain of anyone here. The gap between them narrows once a team needs both brand work and pipeline work in the same engagement.`
      : `${reputationLeader.name} leads this list on both customer reviews and domain strength. The gap to the rest narrows once a team needs both brand work and pipeline work in the same engagement.`,
    takeaways,
    bottomLineFirst: `A SaaS team buying brand and web work first should start with ${reputationLeader.name}, which leads on the reviews that predict how a project actually runs.`,
    bottomLineSecond: `A team that needs buyers to find it before it rewrites its story should start with ${authorityLeader.name}, whose domain does that work already.`,
    leaders,
  };
};

const lines = articleLines(workedCategoryRanking);
const listed = workedCategoryRanking.slice(0, 5);
const leaders = lines.leaders;

/** The four related cards: the other two articles, then a repeat to fill the row. */
const relatedArticles: IndexArticle[] = [
  b2bArticles[1],
  b2bArticles[2],
  b2bArticles[0],
  b2bArticles[1],
];

/** Body sections, in reading order. The jump list is built from this list. */
const sections = [
  { id: "what-separates", title: "What separates these agencies" },
  { id: "where-strongest", title: "Where each one is strongest" },
  { id: "the-ranking", title: "The ranking" },
  { id: "how-we-picked", title: "How we picked these companies" },
  { id: "bottom-line", title: "The bottom line" },
];

const tags = ["B2B Marketing", "SaaS", "Agency Comparison"];

/** Small uppercase label for the summary and bottom-line boxes. */
const BoxLabel = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{children}</p>
);

/** Article card: title, date, category chip. */
const ArticleCard = ({ article, href }: { article: IndexArticle; href: string }) => (
  <a href={href} className="block h-full">
    <WireCard className="flex h-full flex-col gap-4 p-6">
      <p className="font-semibold text-gray-900">{article.title}</p>
      <p className="text-sm text-gray-500">{article.date}</p>
      <WireBadge className="mt-auto self-start">{article.category}</WireBadge>
    </WireCard>
  </a>
);

/** One ranking entry: rank, company name, Index chip, why it placed. */
const RankEntry = ({ company, href }: { company: IndexCompany; href: string }) => (
  <div className="flex gap-6 border-b border-gray-200 py-8 last:border-b-0">
    <span className="w-8 shrink-0 text-2xl font-bold text-gray-300">{company.rank}</span>
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <a href={href} className="text-lg font-semibold text-gray-900">
          {company.name}
        </a>
        <ScoreChip value={company.index} />
      </div>
      <WireText className="text-sm">{company.why}</WireText>
    </div>
  </div>
);

/** Mid-article table: the two leaders on the Index Score and its three parts. */
const LeaderTable = () => (
  <div className="w-full shrink-0 border border-gray-200 bg-white md:w-72">
    <div className="flex items-end gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
      <span className="flex-1 text-[11px] font-semibold text-gray-500">Score</span>
      {leaders.map((company) => (
        <span
          key={company.slug}
          className="w-16 text-center text-[11px] font-semibold leading-tight text-gray-900"
        >
          {company.name}
        </span>
      ))}
    </div>
    {[
      { label: "Index Score", values: leaders.map((company) => company.index) },
      { label: "Reputation", values: leaders.map((company) => company.reputation) },
      { label: "Culture", values: leaders.map((company) => company.culture) },
      { label: "Authority", values: leaders.map((company) => company.authority) },
    ].map((row) => (
      <div
        key={row.label}
        className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 last:border-b-0"
      >
        <span className="flex-1 text-sm text-gray-500">{row.label}</span>
        {row.values.map((value, i) => (
          <span key={i} className="flex w-16 items-baseline justify-center gap-0.5">
            {value === null ? (
              <span className="text-center text-[10px] leading-tight text-gray-500">{NO_DATA}</span>
            ) : (
              <>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
                <span className="text-[10px] text-gray-400">/100</span>
              </>
            )}
          </span>
        ))}
      </div>
    ))}
  </div>
);

/** Header: breadcrumb, H1, dek, meta row. No named byline. */
const ArticleHeader = () => (
  <div className="flex flex-col gap-6">
    <p className="text-sm text-gray-500">
      <a href={B2B_HOME}>Home</a> / <a href={B2B_ARTICLE}>Articles</a> / {TITLE}
    </p>
    <WireHeading level={1}>{TITLE}</WireHeading>
    <WireText>{lines.dek}</WireText>
    <p className="text-sm text-gray-400">{META}</p>
  </div>
);

/** Summary box, then the takeaways, then the jump list. */
const ArticleIntro = () => (
  <div className="flex flex-col gap-12">
    <div className="flex flex-col gap-4 border border-gray-200 bg-gray-50 p-6 md:p-8">
      <BoxLabel>SUMMARY</BoxLabel>
      <WireText>
        SaaS teams hiring a marketing agency usually pick between a brand studio and a demand
        shop, and the two produce different first quarters.
      </WireText>
      <WireText>{lines.summary}</WireText>
    </div>

    <div className="flex flex-col gap-5">
      <WireHeading level={2}>Key takeaways</WireHeading>
      <ul className="flex flex-col gap-3">
        {lines.takeaways.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1.5 size-2 shrink-0 bg-gray-400" />
            <span className="text-gray-500 md:text-md">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/** Sticky rail: the article's own table of contents, floating beside the body. */
const ArticleRail = () => (
  <aside className="hidden lg:block">
    <nav className="sticky top-8 flex flex-col gap-4 border-l border-gray-200 pl-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        In this article
      </p>
      <ol className="flex flex-col gap-3">
        {sections.map((section, i) => (
          <li key={section.id} className="flex items-baseline gap-3 text-sm">
            <span className="text-gray-400">{String(i + 1).padStart(2, "0")}.</span>
            <a href={"#" + section.id} className="text-gray-600">
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  </aside>
);

/** First body section: two deck paragraphs. Pure prose, no names, verbatim. */
const WhatSeparates = () => (
  <section id="what-separates" className="scroll-mt-8">
      <div className="flex flex-col gap-5">
        <WireHeading level={2}>What separates these agencies</WireHeading>
        <WireText>
          Agencies in this category split by what they sell first. Brand studios lead with
          positioning and web work, then layer demand programs on top once the story holds up.
          Demand shops start from pipeline targets and treat the site as the conversion layer, which
          suits a SaaS team with a working message and a quota to hit.
        </WireText>
        <WireText>
          Neither shape is better. They assume different things about what a buyer already has.
        </WireText>
      </div>
    </section>
);

/** Second body section: deck paragraph beside the small comparison table. */
const WhereStrongest = () => (
  <section id="where-strongest" className="scroll-mt-8">
      <div className="flex flex-col gap-5">
        <WireHeading level={2}>Where each one is strongest</WireHeading>
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <WireText className="flex-1">
            Reviews reward agencies that finish projects and keep clients through renewal. Domain
            strength rewards agencies that publish, and that gap explains most of the movement in
            this ranking. An agency can hold excellent reviews and still sit mid-table because
            nobody outside its client list has heard of it.
          </WireText>
          <LeaderTable />
        </div>
      </div>
    </section>
);

/** The ranking: deck line plus the top five, each linking to its profile. */
const RankingSection = () => (
  <section id="the-ranking" className="scroll-mt-8">
      <div className="mb-8 flex flex-col gap-4">
        <WireHeading level={2}>The ranking</WireHeading>
        <WireText>
          Each entry shows the company, its Index Score, and what the score rests on.
        </WireText>
      </div>
      <div className="border-t border-gray-200">
        {listed.map((company) => (
          <RankEntry key={company.slug} company={company} href={companyHref(company.slug)} />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-400">{DATA_NOTE}</p>
    </section>
);

/** Method note, in the article measure. */
const MethodSection = () => (
  <section id="how-we-picked" className="scroll-mt-8">
      <div className="flex flex-col gap-4">
        <WireHeading level={2}>How we picked these companies</WireHeading>
        <WireText>
          We index and score every company on this list, and the order follows the Index Score, the
          average of reputation, culture, and authority. Nobody pays to appear here.
        </WireText>
      </div>
    </section>
);

/** Closing box plus the tag row. */
const BottomLine = () => (
  <section id="bottom-line" className="scroll-mt-8">
      <div className="flex flex-col gap-4 border border-gray-300 bg-white p-6 md:p-8">
        <BoxLabel>THE BOTTOM LINE</BoxLabel>
        <WireText>{lines.bottomLineFirst}</WireText>
        <WireText>{lines.bottomLineSecond}</WireText>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
);

/** Related coverage: deck line plus four article cards. */
const MoreCoverage = () => (
  <RSection size="md" bg="light">
    <RContainer>
      <div className="mb-10 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>More B2B coverage</WireHeading>
        <WireText>Related reading on B2B trends and the companies behind them.</WireText>
      </div>
      <RGrid className="gap-y-8">
        {relatedArticles.map((article, i) => (
          <RCol key={article.title + i} span={3}>
            <ArticleCard article={article} href={B2B_ARTICLE} />
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

export const B2BIndexArticle = () => (
  <div className="bg-white">
    <WireNavbar sitemap={b2bindex} />

    <RSection size="lg" bg="white">
      <RContainer>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,44rem)_16rem]">
          <article className="flex flex-col gap-14">
            <ArticleHeader />
            <ArticleIntro />
            <WhatSeparates />
            <WhereStrongest />
            <RankingSection />
            <MethodSection />
            <BottomLine />
          </article>
          <ArticleRail />
        </div>
      </RContainer>
    </RSection>

    <MoreCoverage />

    <WireFooter sitemap={b2bindex} newsletter={false} />
  </div>
);
