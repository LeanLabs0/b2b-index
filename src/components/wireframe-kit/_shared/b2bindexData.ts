/**
 * b2bindexData.ts: a thin layer over the generated snapshot.
 *
 * Everything the five B2Bindex pages render comes from _shared/b2bindexSnapshot.ts,
 * which the b2b-index-engine writes at stage 08. Nothing here is hand-typed data:
 * this file only reshapes the snapshot into the export names the pages already use,
 * derives the featured company from ?company=<slug>, and derives the compare pair
 * from ?a=<slug>&b=<slug>.
 *
 * Missing data is never zero. A part with no source renders "No data yet" with the
 * reason the engine recorded, and the Index Score averages only the parts that have
 * data.
 */
import { snapshot } from "./b2bindexSnapshot";
import type { DataRow, PartDetail, SnapshotCompany } from "./b2bindexSnapshotTypes";

export type { DataRow, PartDetail, SnapshotCompany };

/** The category this snapshot covers. */
export const WORKED_CATEGORY = snapshot.category;

export type IndexCompany = {
  rank: number;
  /** URL key: /B2BIndexCompany?company=<slug>. */
  slug: string;
  name: string;
  domain: string;
  blurb: string;
  /** Verified record fields. null renders as "Added when claimed". */
  founded: string | null;
  hq: string | null;
  /** null renders as "No data yet": no source passed identity for this part. */
  reputation: number | null;
  culture: number | null;
  authority: number | null;
  index: number;
  /** Index points moved since the last snapshot. null on a first snapshot. */
  delta: number | null;
  /** Two sentences on why the company placed, for the article list. */
  why?: string;
};

const toIndexCompany = (company: SnapshotCompany): IndexCompany => ({
  rank: company.rank,
  slug: company.slug,
  name: company.name,
  domain: company.domain,
  blurb: company.blurb,
  founded: company.founded,
  hq: company.hq,
  reputation: company.reputation,
  culture: company.culture,
  authority: company.authority,
  index: company.index,
  delta: company.delta,
  why: company.why,
});

/** Every company in the snapshot, in rank order. */
export const workedCategoryRanking: IndexCompany[] = [...snapshot.companies]
  .sort((a, b) => a.rank - b.rank)
  .map(toIndexCompany);

const bySlug = new Map(snapshot.companies.map((company) => [company.slug, company]));

/** Look a company up by name. Returns undefined when the snapshot has no such row. */
export const findCompany = (name: string): IndexCompany | undefined =>
  workedCategoryRanking.find((company) => company.name === name);

/** Look a company up by slug. Returns undefined when the snapshot has no such row. */
export const findCompanyBySlug = (slug: string | null): IndexCompany | undefined =>
  slug ? workedCategoryRanking.find((company) => company.slug === slug) : undefined;

/** Read a slug off the query string. Guarded so tests and any SSR pass never throw. */
const slugFromUrl = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
};

const companyFromUrl = (): IndexCompany | undefined => findCompanyBySlug(slugFromUrl("company"));

/** The profile page renders ?company=<slug>, and the top of the ranking otherwise. */
export const featuredCompany: IndexCompany = companyFromUrl() ?? workedCategoryRanking[0];

/* ------------------------------------------------------------------ */
/* Company detail                                                      */
/* ------------------------------------------------------------------ */

export type CompanyDetail = {
  /** Movement label beside the Index Score. */
  delta: string;
  reputation: PartDetail;
  culture: PartDetail;
  authority: PartDetail;
  /** The winning part, called out plainly. */
  best: { part: string; score: string; note: string };
  /** The nearest companies by Index Score, this one excluded. */
  compareWith: IndexCompany[];
};

const PART_LABEL: Record<"reputation" | "culture" | "authority", string> = {
  reputation: "Reputation",
  culture: "Culture",
  authority: "Authority",
};

/** "First snapshot" until there is an earlier snapshot to move against. */
export const deltaLabel = (delta: number | null): string =>
  delta === null
    ? "First snapshot"
    : (delta >= 0 ? "+" + delta : String(delta)) + " since last snapshot";

/** The three nearest companies by Index Score, this one excluded. */
const nearestTo = (company: IndexCompany): IndexCompany[] =>
  workedCategoryRanking
    .filter((other) => other.slug !== company.slug)
    .map((other) => ({ other, gap: Math.abs(other.index - company.index) }))
    .sort((a, b) => a.gap - b.gap || a.other.rank - b.other.rank)
    .slice(0, 3)
    .map((entry) => entry.other)
    .sort((a, b) => b.index - a.index);

export const detailFor = (company: IndexCompany): CompanyDetail => {
  const source = bySlug.get(company.slug);
  const detail = source ? source.detail : undefined;
  const blank: PartDetail = { value: null, rows: [], total: "", math: "" };
  const reputation = detail ? detail.reputation : blank;
  const culture = detail ? detail.culture : blank;
  const authority = detail ? detail.authority : blank;

  const scored = (["reputation", "culture", "authority"] as const)
    .map((key) => ({ key, value: company[key] }))
    .filter((entry): entry is { key: "reputation" | "culture" | "authority"; value: number } =>
      entry.value !== null,
    )
    .sort((a, b) => b.value - a.value);
  const top = scored[0];

  return {
    delta: deltaLabel(company.delta),
    reputation,
    culture,
    authority,
    best: top
      ? {
          part: PART_LABEL[top.key],
          score: top.value + " of 100",
          note: "Strongest part of this company's score.",
        }
      : { part: "", score: "", note: "" },
    compareWith: nearestTo(company),
  };
};

/** The detail behind the featured company's score, one block per part. */
export const featuredCompanyDetail: CompanyDetail = detailFor(featuredCompany);

/* ------------------------------------------------------------------ */
/* Articles and categories                                             */
/* ------------------------------------------------------------------ */

export type IndexArticle = { title: string; date: string; category: string };

/** The first article is the one the Article page renders. */
export const b2bArticles: IndexArticle[] = [
  {
    title: "The best B2B marketing companies for SaaS teams",
    date: "Aug 2026",
    category: WORKED_CATEGORY,
  },
  {
    title: "B2B marketing trends to watch in 2027",
    date: "Aug 2026",
    category: WORKED_CATEGORY,
  },
  {
    title: "What B2B buyers ask AI before they buy",
    date: "Aug 2026",
    category: WORKED_CATEGORY,
  },
];

export type IndexCategory = { name: string; count: number; live?: boolean };

/**
 * Kevin's 32-category taxonomy, in his order. Only the worked category has a
 * ranking behind it, and its count comes from the snapshot.
 */
export const categories: IndexCategory[] = [
  { name: "Accounting", count: 74 },
  { name: "Agriculture", count: 38 },
  { name: "Artificial Intelligence", count: 212 },
  { name: "B2B Consulting / Training", count: 39 },
  { name: "Biotech", count: 88 },
  { name: "Cloud Computing", count: 178 },
  { name: "Construction", count: 42 },
  { name: "Customer Success", count: 61 },
  { name: "Cybersecurity", count: 134 },
  { name: "Data & Analytics", count: 77 },
  { name: "Developer Tools", count: 156 },
  { name: WORKED_CATEGORY, count: snapshot.companies.length, live: true },
  { name: "E-commerce", count: 143 },
  { name: "Energy & Sustainability", count: 67 },
  { name: "Financial Services", count: 119 },
  { name: "Fintech", count: 187 },
  { name: "Healthcare", count: 102 },
  { name: "HR Technology", count: 89 },
  { name: "Legal Technology", count: 53 },
  { name: "Logistics", count: 71 },
  { name: "Manufacturing", count: 48 },
  { name: "Motorsports / Auto", count: 55 },
  { name: "Pharmaceuticals", count: 65 },
  { name: "Procurement", count: 44 },
  { name: "Real Estate Technology", count: 58 },
  { name: "Retail", count: 82 },
  { name: "Reputation / PR", count: 31 },
  { name: "Robotics", count: 47 },
  { name: "SaaS", count: 203 },
  { name: "Sales Tech / RevOps", count: 91 },
  { name: "Staffing", count: 56 },
  { name: "Telecommunications", count: 63 },
];

/** When this snapshot was cut, as the pages print it. */
export const UPDATED_LABEL = snapshot.updatedLabel;

/** Renders once per page, small and gray, so the reader knows when and from where. */
export const DATA_NOTE = UPDATED_LABEL + ", public sources";

/** Value shown where a part has no source yet. Never a dash. */
export const NO_DATA = "No data yet";

/** Value shown where a score has no source yet. Never blank, never zero. */
export const NOT_SCORED = "Not scored yet";

/** Movement label for a company that has no earlier snapshot to move against. */
export const NEW_ENTRY = "New";

/* ------------------------------------------------------------------ */
/* Compare page data                                                   */
/* ------------------------------------------------------------------ */

/** Category averages, for the "+n vs category average" note on the compare table. */
export const categoryAverages = snapshot.categoryAverages;

/** One review platform the company is listed on. Label only, no rating. */
export type ReviewPlatform = { platform: string; href: string };

export type CompareEntity = {
  company: IndexCompany;
  /** Articles on this site that name the company. */
  articleMentions: number;
  /** Movement since the last snapshot, in Index points. null on a first snapshot. */
  movement: number | null;
  reviewLinks: ReviewPlatform[];
};

/** The roundup names the top five, and the two trend pieces name the top three. */
const articleMentionsFor = (company: IndexCompany): number =>
  (company.rank <= 5 ? 1 : 0) + (company.rank <= 3 ? 2 : 0);

const toCompareEntity = (company: IndexCompany): CompareEntity => ({
  company,
  articleMentions: articleMentionsFor(company),
  movement: company.delta,
  reviewLinks: bySlug.get(company.slug)?.sources ?? [],
});

/** The two companies the compare page lines up: ?a=&b=, else ranks 1 and 2. */
export const comparePair: [CompareEntity, CompareEntity] = (() => {
  const fallbackLeft = workedCategoryRanking[0];
  const fallbackRight = workedCategoryRanking[1] ?? workedCategoryRanking[0];
  const left = findCompanyBySlug(slugFromUrl("a")) ?? fallbackLeft;
  let right = findCompanyBySlug(slugFromUrl("b")) ?? fallbackRight;
  if (right.slug === left.slug) {
    right = workedCategoryRanking.find((company) => company.slug !== left.slug) ?? right;
  }
  return [toCompareEntity(left), toCompareEntity(right)];
})();
