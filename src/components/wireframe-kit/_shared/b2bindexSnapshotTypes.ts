export type DataRow = { label: string; value: string; meta?: string; muted?: boolean };
export type PartDetail = { value: number | null; reason?: string; rows: DataRow[]; total: string; math: string };
export type SnapshotCompany = {
  slug: string; name: string; domain: string; blurb: string;
  founded: string | null; hq: string | null;
  reputation: number | null; culture: number | null; authority: number | null;
  index: number; rank: number; delta: number | null; why: string;
  indexMath?: string;
  sources: { platform: string; href: string }[];
  detail: { reputation: PartDetail; culture: PartDetail; authority: PartDetail };
};
export type Snapshot = {
  generatedAt: string; updatedLabel: string; previousSnapshotDate: string | null;
  category: string; companies: SnapshotCompany[];
  categoryAverages: { reputation: number | null; culture: number | null; authority: number | null; index: number | null };
};
