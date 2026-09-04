/**
 * RankingBoard.tsx: the board every B2Bindex ranking uses.
 *
 * The category page and the homepage show the same rows, so they share one
 * component: same columns, same score treatment, same movement indicator.
 */
import { WireButton } from "./Wire";
import { ScoreBox } from "./ScoreBox";
import { NEW_ENTRY, NO_DATA, type IndexCompany } from "./b2bindexData";
import { companyHref } from "./b2bindexSitemap";

/** One part of the score: the number over its name, or "No data yet". */
const PartCell = ({ label, value }: { label: string; value: number | null }) => (
  <span className="flex h-14 w-20 flex-col items-center justify-center gap-1 border border-gray-200 bg-gray-50">
    {value === null ? (
      <span className="px-1 text-center text-[10px] leading-tight text-gray-500">{NO_DATA}</span>
    ) : (
      <span className="flex items-baseline gap-0.5">
        <span className="text-base font-semibold leading-none text-gray-900">{value}</span>
        <span className="text-[9px] leading-none text-gray-400">/100</span>
      </span>
    )}
    <span className="text-[10px] text-gray-500">{label}</span>
  </span>
);

/** Index points moved since the last snapshot, a minor element beside the score.
 *  A company with no earlier snapshot reads "New", with no triangle to read into. */
const Delta = ({ value }: { value: number | null }) => (
  <span className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-500">
    {value !== null && (
      <span aria-hidden="true" className="text-[8px] leading-none">
        {value >= 0 ? "▲" : "▼"}
      </span>
    )}
    {value === null ? NEW_ENTRY : value >= 0 ? `+${value}` : value}
  </span>
);

/** Column headers, aligned to the row grid so every number is labelled. */
export const BoardHeader = () => (
  <div className="flex items-end gap-6 border-b border-gray-200 px-6 py-3">
    <span className="w-6 shrink-0" />
    <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      Company
    </span>
    <span className="hidden shrink-0 gap-3 lg:flex">
      {["Reputation", "Culture", "Authority"].map((label) => (
        <span
          key={label}
          className="w-20 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500"
        >
          {label}
        </span>
      ))}
    </span>
    <span className="hidden w-16 shrink-0 md:flex" />
    <span className="w-16 shrink-0 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      Index Score
    </span>
  </div>
);

/** One row of the ranking board; unclaimed rows show a claim link.
 *  Sibling anchors instead of one wrapping anchor: a nested <a> is invalid HTML. */
export const RankingRow = ({
  company,
  claim = false,
  href,
}: {
  company: IndexCompany;
  claim?: boolean;
  /** Defaults to this company's own profile page. */
  href?: string;
}) => {
  const target = href ?? companyHref(company.slug);
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 px-6 py-5 last:border-b-0">
      <a href={target} className="flex flex-1 items-center gap-6">
        <span className="w-6 shrink-0 text-lg font-semibold text-gray-400">{company.rank}</span>
        <span className="flex flex-1 flex-col gap-1">
          <span className="font-semibold text-gray-900">{company.name}</span>
          <span className="text-sm text-gray-500">{company.blurb}</span>
        </span>
      </a>
      <span className="hidden shrink-0 gap-3 lg:flex">
        <PartCell label="Reputation" value={company.reputation} />
        <PartCell label="Culture" value={company.culture} />
        <PartCell label="Authority" value={company.authority} />
      </span>
      <span className="hidden w-16 shrink-0 justify-end md:flex">
        {claim && (
          <WireButton variant="ghost" size="sm" href={target}>
            Claim
          </WireButton>
        )}
      </span>
      <a href={target} className="flex shrink-0 flex-col items-center">
        <ScoreBox value={company.index} />
        <Delta value={company.delta} />
      </a>
    </div>
  );
};
