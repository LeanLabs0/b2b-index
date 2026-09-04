/**
 * B2BIndexCompare.tsx: B2Bindex head-to-head compare page wireframe.
 *
 * COPY SOURCE: copy/B2BIndexCompare.md, copy_gate PASS (FAIL 0). Every visible
 * sentence comes from that deck verbatim. Everything else on the page is data:
 * scores, movement, gaps, the verdict, the leader badges, the checkmark bullets
 * and the question answers are computed from _shared/b2bindexData.ts, never
 * written by hand. Do not edit deck copy here without re-gating the deck, and
 * re-gate the rendered DOM after edits (copy_gate.py --html).
 *
 * The pair comes from ?a=<slug>&b=<slug>, and falls back to ranks 1 and 2.
 *
 * Deliberately out of scope: pricing, feature matrices, email gates, sponsored
 * strips, and any overall winner. Verdicts are per dimension only.
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
  WireFaq,
  WireFooter,
} from "./_shared/Wire";
import {
  b2bindex,
  companyHref,
  compareHref,
  B2B_COMPARE,
  B2B_HOME,
} from "./_shared/b2bindexSitemap";
import {
  categoryAverages,
  comparePair,
  deltaLabel,
  DATA_NOTE,
  NEW_ENTRY,
  NOT_SCORED,
  UPDATED_LABEL,
  workedCategoryRanking,
  WORKED_CATEGORY,
  type CompareEntity,
  type IndexCompany,
} from "./_shared/b2bindexData";
import { ScoreBox } from "./_shared/ScoreBox";

const [left, right] = comparePair;
const pair = [left, right];
const TITLE = left.company.name + " vs " + right.company.name;
const UPDATED = UPDATED_LABEL;
const METHOD_HREF = companyHref(left.company.slug) + "#how-is-this-calculated";

/** What the page says instead of movement when neither company has a prior snapshot. */
const NO_MOVEMENT =
  "Both companies entered the index in this snapshot, so there is no movement to compare yet.";

/** Movement reads against the last snapshot. */
const movementLabel = (value: number | null) =>
  value === null ? NEW_ENTRY : (value >= 0 ? "+" + value : String(value)) + " since last snapshot";

const bothNew = left.movement === null && right.movement === null;

/** How a score sits against the category average. Empty when there is no average. */
const averageNote = (value: number, average: number | null) => {
  if (average === null) return "";
  const diff = value - average;
  return (diff >= 0 ? "+" + diff : String(diff)) + " vs category average";
};

type PartKey = "reputation" | "culture" | "authority";

const PART_LABEL: Record<PartKey, string> = {
  reputation: "Reputation",
  culture: "Culture",
  authority: "Authority",
};

/** How each part reads inside a sentence. */
const PART_PHRASE: Record<PartKey, string> = {
  reputation: "customer reviews",
  culture: "employee ratings",
  authority: "domain authority",
};

const PARTS: PartKey[] = ["reputation", "culture", "authority"];

const scoreOf = (entity: CompareEntity, key: PartKey | "index") =>
  key === "index" ? entity.company.index : entity.company[key];

/** The four rows that carry a score, in table order. */
const SCORE_ROWS: { label: string; key: PartKey | "index"; average: number | null }[] = [
  { label: "Index Score", key: "index", average: categoryAverages.index },
  { label: "Reputation", key: "reputation", average: categoryAverages.reputation },
  { label: "Culture", key: "culture", average: categoryAverages.culture },
  { label: "Authority", key: "authority", average: categoryAverages.authority },
];

/** The rows that carry a fact instead of a score. No leader badge on these.
 *  `full` replaces both cells with one sentence when the columns would repeat it. */
const FACT_ROWS: {
  label: string;
  value: (entity: CompareEntity) => string;
  full?: string | null;
}[] = [
  {
    label: "Movement",
    value: (entity) => movementLabel(entity.movement),
    full: bothNew ? NO_MOVEMENT : null,
  },
  { label: "Category", value: () => WORKED_CATEGORY },
  { label: "Article mentions", value: (entity) => String(entity.articleMentions) },
  { label: "Domain", value: (entity) => entity.company.domain },
];

/** Which side is ahead on a row, or null when nothing separates them. */
const leaderIndex = (key: PartKey | "index") => {
  const a = scoreOf(left, key);
  const b = scoreOf(right, key);
  if (a === null || b === null || a === b) return null;
  return a > b ? 0 : 1;
};

/** The parts one company leads, skipping any part either side has no source for. */
const partsLedBy = (entity: CompareEntity, other: CompareEntity): PartKey[] =>
  PARTS.filter((key) => {
    const mine = entity.company[key];
    const theirs = other.company[key];
    return mine !== null && theirs !== null && mine > theirs;
  });

const joinList = (items: string[]) =>
  items.length <= 1
    ? items[0] ?? ""
    : items.slice(0, -1).join(", ") + " and " + items[items.length - 1];

/** Three short, factual bullets per company, derived from what it leads. */
const leadBullets = (entity: CompareEntity, other: CompareEntity) => {
  const out: string[] = [];
  if (entity.company.index > other.company.index) {
    out.push("Leads the Index Score, " + entity.company.index + " to " + other.company.index);
  }
  partsLedBy(entity, other).forEach((key) => {
    out.push(
      "Leads on " +
        PART_LABEL[key].toLowerCase() +
        ", " +
        entity.company[key] +
        " to " +
        other.company[key],
    );
  });
  if (
    entity.movement !== null &&
    other.movement !== null &&
    entity.movement > other.movement
  ) {
    out.push("Moving faster, " + movementLabel(entity.movement));
  }
  if (entity.articleMentions > other.articleMentions) {
    out.push(
      "Named in " +
        entity.articleMentions +
        (entity.articleMentions === 1 ? " article" : " articles") +
        ", against " +
        other.articleMentions,
    );
  }
  return out.slice(0, 3);
};

/** The four companies offered as the next comparison. */
const otherCompanies: IndexCompany[] = workedCategoryRanking
  .filter(
    (company) => company.slug !== left.company.slug && company.slug !== right.company.slug,
  )
  .slice(0, 4);

/** The three part definitions, straight from the deck. */
const partDefinitions: { part: string; body: string }[] = [
  {
    part: "Reputation",
    body: "How customers rate the company across review platforms, weighted by how recent those ratings are and how many platforms carry them.",
  },
  {
    part: "Culture",
    body: "How employees rate the company on Glassdoor and Indeed, refreshed every quarter.",
  },
  {
    part: "Authority",
    body: "How the company's domain performs against the others indexed in the same category.",
  },
];

/** Data-derived answers to the four questions buyers ask. */
const indexGap = Math.abs(left.company.index - right.company.index);
const indexLeader = left.company.index >= right.company.index ? left : right;
const indexTrailer = indexLeader === left ? right : left;
const movementLeader =
  (left.movement ?? 0) >= (right.movement ?? 0) ? left : right;
const movementTrailer = movementLeader === left ? right : left;

/** The verdict strip: who leads the Index Score and reviews, and what the other leads. */
const leaderLeadsReviews = partsLedBy(indexLeader, indexTrailer).includes("reputation");
const trailerParts = partsLedBy(indexTrailer, indexLeader).map((key) => PART_PHRASE[key]);
const verdictLine =
  (trailerParts.length > 0
    ? indexLeader.company.name +
      " leads the Index Score" +
      (leaderLeadsReviews ? " and customer reviews" : "") +
      ", while " +
      indexTrailer.company.name +
      " leads " +
      joinList(trailerParts) +
      "."
    : indexLeader.company.name + " leads the Index Score and every scored part.") +
  " Both work in " +
  WORKED_CATEGORY +
  ", so the same three parts drive both scores.";

const movementAnswer = (() => {
  if (bothNew) return NO_MOVEMENT;
  const lead = movementLeader.movement;
  const trail = movementTrailer.movement;
  if (trail === null) {
    return (
      movementLeader.company.name +
      ", up " +
      lead +
      " points since the last snapshot, while " +
      movementTrailer.company.name +
      " entered the index in this snapshot."
    );
  }
  return (
    movementLeader.company.name +
    ", up " +
    lead +
    " points since the last snapshot against " +
    trail +
    " for " +
    movementTrailer.company.name +
    "."
  );
})();

const reputationAnswer = (() => {
  const head =
    categoryAverages.reputation === null
      ? ""
      : "The category average is " + categoryAverages.reputation + ". ";
  const a = left.company.reputation;
  const b = right.company.reputation;
  if (a === null && b === null) {
    return head + "Neither company has enough reviews to score reputation yet.";
  }
  if (a === null) {
    return (
      head +
      right.company.name +
      " scores " +
      b +
      ", and " +
      left.company.name +
      " does not have enough reviews to score reputation yet."
    );
  }
  if (b === null) {
    return (
      head +
      left.company.name +
      " scores " +
      a +
      ", and " +
      right.company.name +
      " does not have enough reviews to score reputation yet."
    );
  }
  const lead = a >= b ? left : right;
  const trail = lead === left ? right : left;
  return (
    head +
    lead.company.name +
    " leads at " +
    lead.company.reputation +
    ", with " +
    trail.company.name +
    " at " +
    trail.company.reputation +
    "."
  );
})();

const questions = [
  {
    q: "Which company has the higher Index Score?",
    a:
      indexLeader.company.name +
      ", at " +
      indexLeader.company.index +
      " to " +
      indexTrailer.company.index +
      ", a gap of " +
      indexGap +
      " points.",
  },
  {
    q: "Which company is moving faster?",
    a: movementAnswer,
  },
  {
    q: "What does a good Reputation score look like?",
    a: reputationAnswer,
  },
  {
    q: "Does payment affect the ranking?",
    a: "No. Both scores come from the same three parts, and nobody pays to appear here.",
  },
];

/** Thin bar under a score, sized to the score itself. */
const ScoreBar = ({ value }: { value: number }) => (
  <span className="mt-2 flex h-1 w-full bg-gray-200">
    <span className="h-1 bg-gray-700" style={{ width: value + "%" }} />
  </span>
);

/** Marks the company ahead on a scored row. */
const LeadsBadge = () => (
  <span className="mt-2 inline-flex self-start border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
    Leads here
  </span>
);

/** One score cell: the number over 100, a bar, the average note, the badge. */
const ScoreCell = ({
  value,
  average,
  leads,
}: {
  value: number | null;
  average: number | null;
  leads: boolean;
}) => {
  const note = value === null ? "" : averageNote(value, average);
  return (
    <div className="flex w-full flex-col">
      {value === null ? (
        <span className="text-sm text-gray-400">{NOT_SCORED}</span>
      ) : (
        <>
          <span className="flex items-baseline gap-1">
            <span className="text-xl font-semibold leading-none text-gray-900">{value}</span>
            <span className="text-[10px] text-gray-400">/100</span>
          </span>
          <ScoreBar value={value} />
          {note && <span className="mt-2 text-xs text-gray-500">{note}</span>}
        </>
      )}
      {leads && <LeadsBadge />}
    </div>
  );
};

/** Header: breadcrumb, H1, deck subhead, updated line. */
const CompareHeader = () => (
  <RSection size="lg" bg="white">
    <RContainer>
      <div className="flex max-w-[48rem] flex-col gap-6">
        <p className="text-sm text-gray-500">
          <a href={B2B_HOME}>Home</a> / <a href={B2B_COMPARE}>Compare</a> / {TITLE}
        </p>
        <WireHeading level={1}>{TITLE}</WireHeading>
        <WireText>
          Compared on reputation, culture, and authority, the three parts behind every Index Score.
        </WireText>
        <p className="text-sm text-gray-400">{UPDATED}</p>
      </div>
    </RContainer>
  </RSection>
);

/** Picker bar: the two chosen companies plus an empty slot for a third. */
const EntityPicker = () => (
  <RSection size="sm" bg="light">
    <RContainer>
      <div className="flex flex-col gap-4 md:flex-row">
        {pair.map((entity) => (
          <div
            key={entity.company.slug}
            className="flex flex-1 items-center gap-4 border border-gray-300 bg-white px-4 py-4"
          >
            <span className="flex h-9 w-16 shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-[10px] font-medium tracking-[0.2em] text-gray-400">
              LOGO
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-semibold text-gray-900">{entity.company.name}</span>
              <span className="text-sm text-gray-500">{entity.company.domain}</span>
            </span>
            <button
              type="button"
              aria-label={"Remove " + entity.company.name}
              className="flex size-7 items-center justify-center border border-gray-300 bg-white text-sm leading-none text-gray-500"
            >
              &#10005;
            </button>
          </div>
        ))}
        <div className="flex flex-1 items-center justify-center border border-dashed border-gray-400 bg-white px-4 py-4">
          <span className="text-sm font-medium text-gray-500">+ Add company</span>
        </div>
      </div>
    </RContainer>
  </RSection>
);

/** The templated verdict, in a strip that reads before anything else. */
const Verdict = () => (
  <RSection size="md" bg="white">
    <RContainer>
      <div className="flex flex-col gap-4 border-2 border-gray-900 bg-white p-6 md:p-10">
        <WireHeading level={2}>Read the verdict</WireHeading>
        <WireText>{verdictLine}</WireText>
      </div>
    </RContainer>
  </RSection>
);

/** One score header card: the Index Score, movement, category, domain, profile link. */
const ScoreHeaderCard = ({ entity }: { entity: CompareEntity }) => (
  <WireCard className="flex h-full flex-col items-start gap-5">
    <div className="flex items-center gap-5">
      <ScoreBox value={entity.company.index} size="lg" strong />
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-gray-900">{entity.company.name}</p>
        <span className="inline-flex items-center gap-1.5 self-start border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
          {entity.movement !== null && (
            <span aria-hidden="true" className="text-[8px] leading-none">
              {entity.movement >= 0 ? "▲" : "▼"}
            </span>
          )}
          {deltaLabel(entity.movement)}
        </span>
        <WireBadge>{WORKED_CATEGORY}</WireBadge>
        <p className="text-sm text-gray-500">{entity.company.domain}</p>
      </div>
    </div>
    <WireButton variant="ghost" size="sm" href={companyHref(entity.company.slug)}>
      See the full profile
    </WireButton>
  </WireCard>
);

const ScoreHeaders = () => (
  <RSection size="md" bg="light">
    <RContainer>
      <RGrid className="gap-y-6">
        {pair.map((entity) => (
          <RCol key={entity.company.slug} span={6}>
            <ScoreHeaderCard entity={entity} />
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

/** The table: four scored rows with leader badges, then four fact rows. */
const CompareTable = () => (
  <RSection size="md" bg="white">
    <RContainer>
      <div className="mb-8 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>Compare the numbers</WireHeading>
        <WireText>
          Each score runs from 1 to 100. The badge marks the company ahead on that row, and the note
          beside each number shows how it sits against the category average.
        </WireText>
      </div>
      <div className="border border-gray-200 bg-white">
        <div className="flex items-end gap-6 border-b border-gray-200 bg-gray-50 px-6 py-4">
          <span className="w-40 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Measure
          </span>
          {pair.map((entity) => (
            <span key={entity.company.slug} className="flex-1 text-sm font-semibold text-gray-900">
              {entity.company.name}
            </span>
          ))}
        </div>
        {SCORE_ROWS.map((row) => {
          const winner = leaderIndex(row.key);
          return (
            <div
              key={row.label}
              className="flex items-start gap-6 border-b border-gray-200 px-6 py-5"
            >
              <span className="w-40 shrink-0 pt-1 text-sm font-medium text-gray-900">
                {row.label}
              </span>
              {pair.map((entity, i) => (
                <span key={entity.company.slug} className="flex-1">
                  <ScoreCell
                    value={scoreOf(entity, row.key)}
                    average={row.average}
                    leads={winner === i}
                  />
                </span>
              ))}
            </div>
          );
        })}
        {FACT_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-6 border-b border-gray-200 px-6 py-5 last:border-b-0"
          >
            <span className="w-40 shrink-0 text-sm font-medium text-gray-900">{row.label}</span>
            {row.full ? (
              <span className="flex-1 text-sm text-gray-500">{row.full}</span>
            ) : (
              pair.map((entity) => (
                <span key={entity.company.slug} className="flex-1 text-sm text-gray-500">
                  {row.value(entity)}
                </span>
              ))
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-400">{DATA_NOTE}</p>
    </RContainer>
  </RSection>
);

/** How the score is built, with the three definitions and a link to the method. */
const HowWeScore = () => (
  <RSection size="md" bg="light">
    <RContainer>
      <div className="mb-10 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>How we score</WireHeading>
        <WireText>
          The Index Score averages three parts, and only parts with a live data source count toward
          it.
        </WireText>
      </div>
      <RGrid className="gap-y-8">
        {partDefinitions.map((item) => (
          <RCol key={item.part} span={4}>
            <WireCard className="flex h-full flex-col gap-3">
              <WireHeading level={3}>{item.part}</WireHeading>
              <WireText className="text-sm">{item.body}</WireText>
            </WireCard>
          </RCol>
        ))}
      </RGrid>
      <div className="mt-8">
        <WireButton variant="ghost" size="sm" href={METHOD_HREF}>
          See how the score is calculated
        </WireButton>
      </div>
    </RContainer>
  </RSection>
);

/** One part, both companies on labelled bars, with the gap stated in words. */
const PartBlock = ({ part }: { part: PartKey }) => {
  const values = pair.map((entity) => entity.company[part]);
  const [a, b] = values;
  const gap = a !== null && b !== null ? Math.abs(a - b) : null;
  const leader = a !== null && b !== null && a !== b ? (a > b ? left : right) : null;
  const gapLine =
    leader && gap !== null
      ? leader.company.name + " leads by " + gap + " points"
      : gap === null
        ? "Only one company is scored on this part"
        : "Both companies score the same";
  return (
    <div className="flex flex-col gap-5 border border-gray-200 bg-white p-6">
      <WireHeading level={3}>{PART_LABEL[part]}</WireHeading>
      <div className="flex flex-col gap-4">
        {pair.map((entity, i) => {
          const value = values[i];
          return (
            <div key={entity.company.slug} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-gray-600">{entity.company.name}</span>
                {value === null ? (
                  <span className="text-sm text-gray-400">{NOT_SCORED}</span>
                ) : (
                  <span className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold leading-none text-gray-900">{value}</span>
                    <span className="text-[10px] text-gray-400">/100</span>
                  </span>
                )}
              </div>
              {value !== null && (
                <span className="flex h-2 w-full bg-gray-200">
                  <span className="h-2 bg-gray-700" style={{ width: value + "%" }} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-sm font-medium text-gray-900">{gapLine}</p>
    </div>
  );
};

const PartsBreakdown = () => (
  <RSection size="md" bg="white">
    <RContainer>
      <div className="mb-10 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>Look at each part</WireHeading>
        <WireText>
          The gap on each part explains the gap in the Index Score, so we show both companies side
          by side on all three.
        </WireText>
      </div>
      <RGrid className="gap-y-8">
        {PARTS.map((part) => (
          <RCol key={part} span={4}>
            <PartBlock part={part} />
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

/** Two cards, each listing what its company leads on. No overall winner. */
const ChooseOne = () => (
  <RSection size="md" bg="light">
    <RContainer>
      <div className="mb-10 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>Choose one</WireHeading>
        <WireText>
          Neither company wins outright, because each leads a different part of the score.
        </WireText>
      </div>
      <RGrid className="gap-y-8">
        {pair.map((entity, i) => (
          <RCol key={entity.company.slug} span={6}>
            <WireCard className="flex h-full flex-col gap-5">
              <WireHeading level={3}>{entity.company.name}</WireHeading>
              <ul className="flex flex-col gap-3">
                {leadBullets(entity, pair[1 - i]).map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 text-sm text-gray-500">
                      &#10003;
                    </span>
                    <span className="text-sm text-gray-600">{bullet}</span>
                  </li>
                ))}
              </ul>
              <WireButton
                variant="ghost"
                size="sm"
                href={companyHref(entity.company.slug)}
                className="mt-auto"
              >
                See the full profile
              </WireButton>
            </WireCard>
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

/** Outbound platform links, one row per company. Labels only, no ratings. */
const ReviewLinks = () => (
  <RSection size="md" bg="white">
    <RContainer>
      <div className="mb-8 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>Read the reviews yourself</WireHeading>
        <WireText>
          We link to the platforms rather than republish their ratings, so you can read the reviews
          at the source.
        </WireText>
      </div>
      <div className="border border-gray-200 bg-white">
        {pair.map((entity) => (
          <div
            key={entity.company.slug}
            className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
          >
            <span className="font-semibold text-gray-900">{entity.company.name}</span>
            <span className="flex flex-wrap gap-3">
              {entity.reviewLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  className="border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600"
                >
                  {link.platform}
                </a>
              ))}
            </span>
          </div>
        ))}
      </div>
    </RContainer>
  </RSection>
);

/** Compact recap under the questions: score, what each leads, movement. */
const RecapTable = () => (
  <div className="border border-gray-200 bg-white">
    <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      <span className="flex-1">Company</span>
      <span className="w-24 text-center">Index Score</span>
      <span className="w-40">Leads on</span>
      <span className="w-24 text-right">Movement</span>
    </div>
    {pair.map((entity, i) => {
      const other = pair[1 - i];
      const leads: string[] = [];
      if (entity.company.index > other.company.index) leads.push("Index Score");
      partsLedBy(entity, other).forEach((key) => leads.push(PART_LABEL[key]));
      return (
        <div
          key={entity.company.slug}
          className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 text-sm last:border-b-0"
        >
          <span className="flex-1 font-medium text-gray-900">{entity.company.name}</span>
          <span className="flex w-24 items-baseline justify-center gap-1">
            <span className="font-semibold text-gray-900">{entity.company.index}</span>
            <span className="text-[10px] text-gray-400">/100</span>
          </span>
          <span className="w-40 text-gray-500">{leads.join(", ")}</span>
          <span className="w-24 text-right text-gray-500">
            {entity.movement === null
              ? NEW_ENTRY
              : entity.movement >= 0
                ? "+" + entity.movement
                : entity.movement}
          </span>
        </div>
      );
    })}
  </div>
);

/** The next comparison: four more companies from the same category. */
const CompareOthers = () => (
  <RSection size="md" bg="light">
    <RContainer>
      <div className="mb-10 flex max-w-[48rem] flex-col gap-4">
        <WireHeading level={2}>Compare other companies</WireHeading>
        <WireText>
          Every company indexed in Digital &amp; AI Marketing is ready to line up against these two.
        </WireText>
      </div>
      <RGrid className="gap-y-8">
        {otherCompanies.map((company) => (
          <RCol key={company.slug} span={3}>
            <WireCard className="flex h-full flex-col gap-4">
              <ScoreBox value={company.index} />
              <p className="font-semibold text-gray-900">{company.name}</p>
              <p className="text-sm text-gray-500">{company.blurb}</p>
              <WireButton
                variant="ghost"
                size="sm"
                href={compareHref(left.company.slug, company.slug)}
                className="mt-auto"
              >
                Compare
              </WireButton>
            </WireCard>
          </RCol>
        ))}
      </RGrid>
    </RContainer>
  </RSection>
);

/** Page meta line, above the site footer. */
const PageMeta = () => (
  <RSection size="sm" bg="white">
    <RContainer>
      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
        <span>{UPDATED}</span>
        <span className="flex gap-6">
          <a href={METHOD_HREF}>Methodology</a>
          <a href="#">Suggest a correction</a>
        </span>
      </div>
    </RContainer>
  </RSection>
);

export const B2BIndexCompare = () => (
  <div className="bg-white">
    <WireNavbar sitemap={b2bindex} />

    <CompareHeader />

    <EntityPicker />

    <Verdict />

    <ScoreHeaders />

    <CompareTable />

    <HowWeScore />

    <PartsBreakdown />

    <ChooseOne />

    <ReviewLinks />

    <WireFaq
      title="Common questions"
      description="Buyers ask the same four questions about a comparison, so we answer them here."
      items={questions}
      openAll
      bg="light"
    >
      <RecapTable />
    </WireFaq>

    <CompareOthers />

    <PageMeta />

    <WireFooter sitemap={b2bindex} newsletter={false} />
  </div>
);
