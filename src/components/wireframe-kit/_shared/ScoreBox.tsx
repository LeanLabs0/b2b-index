/**
 * ScoreBox.tsx: one grade, rendered the same way everywhere.
 *
 * Every score B2Bindex computes runs 1 to 100, so the box always carries its
 * denominator. Source ratings from other platforms (4.4 out of 5) never use
 * this component.
 */
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; value: string; denom: string }> = {
  sm: { box: "size-14", value: "text-lg", denom: "text-[9px]" },
  md: { box: "size-16", value: "text-2xl", denom: "text-[10px]" },
  lg: { box: "size-32", value: "text-5xl", denom: "text-xs" },
};

export const ScoreBox = ({
  value,
  size = "md",
  strong = false,
  className = "",
}: {
  value: number;
  size?: Size;
  strong?: boolean;
  className?: string;
}) => {
  const s = SIZES[size];
  return (
    <span
      className={`flex ${s.box} shrink-0 flex-col items-center justify-center gap-0.5 border ${
        strong ? "border-gray-300 bg-white" : "border-gray-300 bg-gray-50"
      } ${className}`}
    >
      <span className={`${s.value} font-semibold leading-none text-gray-900`}>{value}</span>
      <span className={`${s.denom} leading-none text-gray-400`}>/100</span>
    </span>
  );
};

/** The same grade as an inline chip, for running text and list entries. */
export const ScoreChip = ({ value }: { value: number }) => (
  <span className="inline-flex items-baseline gap-1 border border-gray-300 bg-gray-50 px-2.5 py-1">
    <span className="text-sm font-semibold text-gray-900">{value}</span>
    <span className="text-[10px] text-gray-400">/100</span>
  </span>
);
