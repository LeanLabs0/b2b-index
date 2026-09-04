/**
 * Wire.tsx — the wireframe design language. Source of truth.
 *
 * Grayscale wireframe kit built on @relume_io/relume-ui and Relume's
 * 12-column grid + section taxonomy. Wireframe pages compose ONLY the
 * exports of this file. If a pattern is missing, add it here first,
 * following the grid rules, then use it.
 *
 * Style rules (non-negotiable):
 *  - Grayscale only: white/gray-50 fills, gray-200/300 borders, gray-400+ text.
 *  - No annotation/corner tags on elements. Image placeholders keep their
 *    centered label text (e.g. "HERO IMAGE").
 *  - Short realistic placeholder copy — no lorem ipsum, no emojis, no branding.
 */
import { useState, type ReactNode } from "react";
import { Button, Input, cn } from "@relume_io/relume-ui";
import { BiSolidStar } from "react-icons/bi";
import { RxChevronDown } from "react-icons/rx";

/* ----------------------------------------------------------------------- */
/* Sitemap — single source of truth for nav + footer                       */
/* ----------------------------------------------------------------------- */

export type NavNode = {
  title: string;
  path?: string;
  /** One-line blurb shown in mega menu link rows. */
  description?: string;
  /** Children render as a dropdown; set `mega` for a full-width panel. */
  children?: NavNode[];
  mega?: boolean;
};

/** Logo treatment. "image" renders the real asset AS-IS (user opt-in —
 *  the one sanctioned exception to grayscale, confined to the logo slot). */
export type WireLogoSpec =
  | { kind: "box" }
  | { kind: "wordmark"; text: string }
  | { kind: "image"; src: string; alt?: string };

export type Sitemap = {
  name: string;
  logo?: WireLogoSpec;
  main: NavNode[];
  ctas?: string[];
  /** Hrefs for `ctas`, same order. Omit to keep the buttons non-functional. */
  ctaLinks?: string[];
  /** Href for the logo/wordmark slot in the navbar and footer. */
  home?: string;
  footer?: { title: string; links: NavNode[] }[];
  legal?: string[];
};

/* ----------------------------------------------------------------------- */
/* Grid system (Relume conventions)                                        */
/* ----------------------------------------------------------------------- */

type SectionSize = "sm" | "md" | "lg" | "xl";
type SectionBg = "white" | "light" | "dark";

/* Rhythm note: pages read best with uniform air (Kevin's v4: 96px everywhere).
   sm/md are for quote bands and strips — kept generous so seams don't cramp. */
const sectionPad: Record<SectionSize, string> = {
  sm: "py-16",
  md: "py-20",
  lg: "py-24",
  xl: "py-28",
};

const sectionBg: Record<SectionBg, string> = {
  white: "bg-white",
  light: "bg-gray-50",
  dark: "bg-gray-900",
};

export const RSection = ({
  size = "lg",
  bg = "white",
  id,
  className,
  children,
}: {
  size?: SectionSize;
  bg?: SectionBg;
  /** Anchor target for same-page links. */
  id?: string;
  className?: string;
  children: ReactNode;
}) => (
  <section id={id} className={cn("px-[5%]", sectionPad[size], sectionBg[bg], className)}>
    {children}
  </section>
);

export const RContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <div className={cn("mx-auto w-full max-w-[80rem]", className)}>{children}</div>;

export const RGrid = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-8", className)}>
    {children}
  </div>
);

/** Column spans must be literal classes for Tailwind JIT — hence the map. */
const colSpan: Record<number, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  12: "md:col-span-12",
};

export const RCol = ({
  span = 12,
  className,
  children,
}: {
  span?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12;
  className?: string;
  children: ReactNode;
}) => <div className={cn(colSpan[span], className)}>{children}</div>;

/* ----------------------------------------------------------------------- */
/* Primitives                                                              */
/* ----------------------------------------------------------------------- */

/* Arbitrary values on purpose: the Relume preset shrinks the named scale
   (its text-6xl is 2.5rem), which flattened every H1 to 40px. Target:
   H1 60px desktop, H2 36px, ~3.7x head-to-body contrast (Kevin's v4). */
const headingLevel: Record<1 | 2 | 3, string> = {
  1: "text-[2.5rem] font-bold leading-[1.1] text-gray-900 md:text-[3.25rem] lg:text-[3.75rem]",
  2: "text-[1.75rem] font-bold leading-[1.15] text-gray-900 md:text-[2.25rem]",
  3: "text-lg font-semibold text-gray-900 md:text-xl",
};

export const WireHeading = ({
  level = 2,
  className,
  children,
}: {
  level?: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}) => {
  const Tag = (`h${level}`) as "h1" | "h2" | "h3";
  return <Tag className={cn(headingLevel[level], className)}>{children}</Tag>;
};

/**
 * Real copy via children, or skeleton line-blocks via `lines`
 * (last line renders shorter).
 */
export const WireText = ({
  lines,
  className,
  children,
}: {
  lines?: number;
  className?: string;
  children?: ReactNode;
}) => {
  if (lines) {
    return (
      <div className={cn("flex w-full flex-col gap-2.5", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn("h-3 rounded-sm bg-gray-200", i === lines - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    );
  }
  return <p className={cn("text-base text-gray-500", className)}>{children}</p>;
};

const imageRatio: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
};

/** Crossed placeholder box with a centered label. */
export const WireImage = ({
  label = "IMAGE",
  ratio = "4/3",
  className,
}: {
  label?: string;
  ratio?: keyof typeof imageRatio;
  className?: string;
}) => (
  <div
    className={cn(
      "relative w-full overflow-hidden border border-gray-200 bg-gray-100",
      imageRatio[ratio],
      className,
    )}
  >
    <svg
      className="absolute inset-0 size-full text-gray-300"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tracking-[0.2em] text-gray-400 md:text-xs">
      {label}
    </span>
  </div>
);

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const wireButtonVariant: Record<ButtonVariant, string> = {
  primary: "border-gray-900 bg-gray-900 text-white",
  secondary: "border-gray-300 bg-white text-gray-800",
  ghost: "border-transparent bg-transparent text-gray-800 underline underline-offset-4",
};

const wireButtonSize: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

/* Ghost renders as a flush inline text link — no padding, so it aligns
   with surrounding content edges (e.g. inside WireCard). */
const wireGhostSize: Record<ButtonSize, string> = {
  sm: "p-0 text-sm",
  md: "p-0",
  lg: "p-0 text-lg",
};

/** Wraps Relume Button, restyled to grayscale.
 *  With `href` it renders as a real anchor (same styling) so wireframes click through. */
export const WireButton = ({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Makes the button a link. Omit to keep it non-functional. */
  href?: string;
  className?: string;
  children: ReactNode;
}) => (
  <Button
    asChild={Boolean(href)}
    title={typeof children === "string" ? children : "Button"}
    className={cn(
      wireButtonVariant[variant],
      variant === "ghost" ? wireGhostSize[size] : wireButtonSize[size],
      className,
    )}
  >
    {href ? <a href={href}>{children}</a> : children}
  </Button>
);

export const WireBadge = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600",
      className,
    )}
  >
    {children}
  </span>
);

/** Wraps Relume Input, restyled to grayscale. */
export const WireInput = ({
  placeholder = "Enter your email",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => (
  <Input
    placeholder={placeholder}
    className={cn("border-gray-300 text-gray-700 placeholder:text-gray-400", className)}
  />
);

export const WireCard = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("border border-gray-200 bg-white p-6 md:p-8", className)}>{children}</div>
);

/** Rows of a small square marker + text (or a skeleton line). */
export const WireList = ({
  items,
  count = 3,
  className,
}: {
  items?: string[];
  count?: number;
  className?: string;
}) => {
  const rows = items ?? Array.from({ length: count }).map(() => "");
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {rows.map((item, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="size-4 shrink-0 border border-gray-300 bg-gray-100" />
          {item ? (
            <span className="text-sm text-gray-600">{item}</span>
          ) : (
            <span className="h-3 w-full max-w-56 rounded-sm bg-gray-200" />
          )}
        </li>
      ))}
    </ul>
  );
};

const Stars = ({ className }: { className?: string }) => (
  <div className={cn("flex gap-0.5 text-gray-800", className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <BiSolidStar key={i} className="size-4" />
    ))}
  </div>
);

export const WireTestimonialCard = ({
  quote = "This changed how our team works. We shipped the redesign two weeks early.",
  name = "Jamie Doe",
  role = "Product Lead, Acme Co",
  className,
}: {
  quote?: string;
  name?: string;
  role?: string;
  className?: string;
}) => (
  <WireCard className={className}>
    <Stars className="mb-5" />
    <blockquote className="mb-6 text-gray-700">"{quote}"</blockquote>
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[9px] font-medium tracking-widest text-gray-400">
        AV
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </WireCard>
);

export const WireDivider = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-gray-200", className)} />
);

/** Compact quote strip: left border, italic quote, avatar + attribution.
 *  Used as per-section testimonial snippets under content sections. */
export const WireQuote = ({
  quote,
  name = "Jamie Doe",
  role = "Product Lead, Acme Co",
  photo = false,
  proofline,
  className,
}: {
  quote: string;
  name?: string;
  role?: string;
  /** Square PHOTO placeholder instead of the small avatar circle. */
  photo?: boolean;
  /** One credibility line under name/role (e.g. "Runs the fan-out audits behind onboarding"). */
  proofline?: string;
  className?: string;
}) => (
  <figure className={cn("border-l-2 border-gray-900 pl-6", className)}>
    <blockquote className="text-lg italic text-gray-800 md:text-xl">"{quote}"</blockquote>
    <figcaption className="mt-4 flex items-start gap-3">
      {photo ? (
        <WireImage label="PHOTO" ratio="1/1" className="w-16 shrink-0" />
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[9px] font-medium tracking-widest text-gray-400">
          AV
        </span>
      )}
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-gray-500">{name}{role ? `, ${role}` : ""}</span>
        {proofline && <span className="text-xs text-gray-400">{proofline}</span>}
      </span>
    </figcaption>
  </figure>
);

/** Grayscale chart placeholder: ascending bars or a trend line, with tick labels.
    Evidence visual (Kevin's v4 pattern) — data stays skeleton, no invented numbers. */
export const WireChart = ({
  label = "CHART",
  kind = "bar",
  ticks = [],
  className,
}: {
  label?: string;
  kind?: "bar" | "trend";
  /** X-axis labels under the plot (e.g. ["Week 1", "Week 4", "Week 8"]). */
  ticks?: string[];
  className?: string;
}) => (
  <div className={cn("border border-gray-200 bg-white p-6", className)}>
    <p className="mb-4 text-[10px] font-medium tracking-[0.2em] text-gray-400">{label}</p>
    {kind === "bar" ? (
      <div className="flex h-36 items-end gap-3">
        {[35, 50, 62, 78, 90].map((h, i) => (
          <div key={i} className="flex-1 border border-gray-200 bg-gray-100" style={{ height: `${h}%` }} />
        ))}
      </div>
    ) : (
      <svg viewBox="0 0 100 40" className="h-36 w-full text-gray-300" preserveAspectRatio="none">
        <polyline
          points="0,36 20,32 40,26 60,18 80,10 100,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <line x1="0" y1="39" x2="100" y2="39" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>
    )}
    {ticks.length > 0 && (
      <div className="mt-3 flex justify-between">
        {ticks.map((t) => (
          <span key={t} className="text-xs text-gray-400">{t}</span>
        ))}
      </div>
    )}
  </div>
);

/** Code-snippet placeholder (e.g. a schema JSON-LD block). Real lines via
    `lines`, or gray skeleton rows when omitted. */
export const WireCode = ({
  lines,
  count = 5,
  className,
}: {
  lines?: string[];
  count?: number;
  className?: string;
}) => (
  <pre className={cn("overflow-x-auto border border-gray-200 bg-gray-50 p-5 font-mono text-sm text-gray-600", className)}>
    {lines ? (
      lines.join("\n")
    ) : (
      <span className="flex flex-col gap-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cn("h-3 rounded-sm bg-gray-200", i % 3 === 1 ? "w-2/3" : i % 3 === 2 ? "w-1/2" : "w-5/6")}
          />
        ))}
      </span>
    )}
  </pre>
);

const WireLogo = ({ label = "LOGO", className }: { label?: string; className?: string }) => (
  <span
    className={cn(
      "flex h-9 w-24 items-center justify-center border border-gray-200 bg-gray-50 text-[10px] font-medium tracking-[0.2em] text-gray-400",
      className,
    )}
  >
    {label}
  </span>
);

/** Renders a logo per its spec. Image logos render untouched (no filter).
 *  With `href` the slot becomes a link home. */
const WireLogoRender = ({ spec, href }: { spec: WireLogoSpec; href?: string }) => {
  const mark =
    spec.kind === "wordmark" ? (
      <span className="text-xl font-bold text-gray-900">{spec.text}</span>
    ) : spec.kind === "image" ? (
      <img src={spec.src} alt={spec.alt ?? "Logo"} className="h-8 w-auto" />
    ) : (
      <WireLogo />
    );
  return href ? (
    <a href={href} className="inline-flex items-center">
      {mark}
    </a>
  ) : (
    mark
  );
};

const WireIcon = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "flex size-11 items-center justify-center border border-gray-300 bg-gray-50",
      className,
    )}
  >
    <span className="size-4 rotate-45 border border-gray-400" />
  </span>
);

/* ----------------------------------------------------------------------- */
/* Section patterns                                                        */
/* ----------------------------------------------------------------------- */

/**
 * Full-width mega menu panel. Canonical layout: 2–4 link-group columns
 * (group title + link rows with optional one-line descriptions), plus a
 * featured card column on the right. Used floating inside an interactive
 * WireNavbar, or render it yourself with floating={false} to show the
 * open state statically on a page.
 */
export const WireMegaPanel = ({
  node,
  floating = true,
}: {
  node: NavNode;
  floating?: boolean;
}) => {
  const children = node.children ?? [];
  const groups = children.filter((c) => c.children?.length);
  const loose = children.filter((c) => !c.children?.length);
  const cols = [...groups, ...(loose.length ? [{ title: node.title, children: loose }] : [])];
  return (
    <div
      className={cn(
        "border-b border-gray-200 bg-white px-[5%] py-8",
        floating && "absolute left-0 right-0 top-full z-50",
      )}
    >
      <RContainer>
        <RGrid className="gap-y-8">
          {cols.slice(0, 3).map((group) => (
            <RCol key={group.title} span={3}>
              <p className="mb-4 text-sm font-semibold text-gray-900">{group.title}</p>
              <ul className="flex flex-col gap-4">
                {(group.children ?? []).map((link) => (
                  <li key={link.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-gray-300 bg-gray-50">
                      <span className="size-3 rotate-45 border border-gray-400" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-gray-900">{link.title}</span>
                      {link.description && (
                        <span className="block text-xs text-gray-500">{link.description}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </RCol>
          ))}
          <RCol span={3}>
            <div className="flex h-full flex-col gap-3 bg-gray-50 p-4">
              <WireImage label="FEATURED" ratio="16/9" />
              <p className="text-sm font-semibold text-gray-900">Featured article title</p>
              <WireText className="text-xs">One short line about the featured content.</WireText>
              <WireButton variant="ghost" size="sm" className="self-start">
                Read more
              </WireButton>
            </div>
          </RCol>
        </RGrid>
      </RContainer>
    </div>
  );
};

/** Small dropdown panel for nav items with few, flat children. */
const WireDropdown = ({ node }: { node: NavNode }) => (
  <div className="absolute left-0 top-full z-50 mt-3 w-64 border border-gray-200 bg-white py-2">
    {(node.children ?? []).map((link) => (
      <a key={link.title} href={link.path ?? "#"} className="block px-4 py-2 hover:bg-gray-50">
        <span className="block text-sm text-gray-800">{link.title}</span>
        {link.description && (
          <span className="block text-xs text-gray-500">{link.description}</span>
        )}
      </a>
    ))}
  </div>
);

export const WireNavbar = ({
  links = ["Product", "Features", "Pricing", "About"],
  cta = true,
  ctaLabels = ["Log in", "Sign up"],
  sitemap,
  logo,
  interactive = false,
}: {
  links?: string[];
  cta?: boolean;
  /** Button labels, left to right; the last renders primary, the rest secondary. */
  ctaLabels?: string[];
  /** Single source of truth for items, CTAs, and logo. Overrides links/ctaLabels. */
  sitemap?: Sitemap;
  logo?: WireLogoSpec;
  /** Opt-in (ask the user first): dropdowns/mega menus open on hover or click. */
  interactive?: boolean;
}) => {
  const items: NavNode[] = sitemap ? sitemap.main : links.map((title) => ({ title }));
  const ctas = sitemap?.ctas ?? (cta ? ctaLabels : []);
  const ctaLinks = sitemap?.ctaLinks ?? [];
  const logoSpec: WireLogoSpec =
    logo ?? sitemap?.logo ?? (sitemap ? { kind: "wordmark", text: sitemap.name } : { kind: "box" });
  const [open, setOpen] = useState<number | null>(null);
  const openNode = open !== null ? items[open] : null;

  return (
    <section
      className="relative z-40 border-b border-gray-200 bg-white px-[5%]"
      onMouseLeave={interactive ? () => setOpen(null) : undefined}
    >
      <RContainer className="flex min-h-16 items-center justify-between gap-8 md:min-h-18">
        <WireLogoRender spec={logoSpec} href={sitemap?.home} />
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item, i) =>
            item.children?.length ? (
              <div key={item.title} className="relative">
                <button
                  className="flex items-center gap-1 text-sm text-gray-600"
                  aria-expanded={open === i}
                  onMouseEnter={interactive ? () => setOpen(i) : undefined}
                  onClick={interactive ? () => setOpen(i) : undefined}
                >
                  {item.title}
                  <RxChevronDown
                    className={cn("size-4 transition-transform", open === i && "rotate-180")}
                  />
                </button>
                {interactive && open === i && !item.mega && <WireDropdown node={item} />}
              </div>
            ) : item.path ? (
              <a
                key={item.title}
                href={item.path}
                className="text-sm text-gray-600"
                onMouseEnter={interactive ? () => setOpen(null) : undefined}
              >
                {item.title}
              </a>
            ) : (
              <span
                key={item.title}
                className="text-sm text-gray-600"
                onMouseEnter={interactive ? () => setOpen(null) : undefined}
              >
                {item.title}
              </span>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          {ctas.map((label, i) => (
            <WireButton
              key={label}
              size="sm"
              href={ctaLinks[i]}
              variant={i === ctas.length - 1 ? "primary" : "secondary"}
            >
              {label}
            </WireButton>
          ))}
          <span className="flex size-10 flex-col items-center justify-center gap-1 md:hidden">
            <span className="h-0.5 w-5 bg-gray-700" />
            <span className="h-0.5 w-5 bg-gray-700" />
            <span className="h-0.5 w-5 bg-gray-700" />
          </span>
        </div>
      </RContainer>
      {interactive && openNode?.mega && <WireMegaPanel node={openNode} />}
    </section>
  );
};

type HeaderSplit = "centered" | "6-6" | "5-7" | "7-5";

export const WireHeader = ({
  split = "6-6",
  title = "A clear headline about the core value",
  subtitle = "One or two supporting sentences that explain what this product does and who it is for.",
  bullets,
  buttons = 2,
  buttonLabels = ["Get started", "Learn more"],
  buttonLinks = [],
  imageLabel = "HERO IMAGE",
  bg = "white",
}: {
  split?: HeaderSplit;
  title?: string;
  subtitle?: string;
  /** Short deliverable bullets rendered between the subtitle and the buttons. */
  bullets?: string[];
  buttons?: 0 | 1 | 2;
  buttonLabels?: string[];
  /** Hrefs for `buttonLabels`, same order. Omit to keep the buttons non-functional. */
  buttonLinks?: string[];
  imageLabel?: string;
  bg?: SectionBg;
}) => {
  const actions = buttons > 0 && (
    <div className="flex flex-wrap gap-4">
      <WireButton href={buttonLinks[0]}>{buttonLabels[0] ?? "Get started"}</WireButton>
      {buttons > 1 && (
        <WireButton variant="secondary" href={buttonLinks[1]}>
          {buttonLabels[1] ?? "Learn more"}
        </WireButton>
      )}
    </div>
  );

  if (split === "centered") {
    return (
      <RSection size="xl" bg={bg}>
        <RContainer>
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-6 text-center md:mb-16">
            <WireHeading level={1}>{title}</WireHeading>
            <WireText>{subtitle}</WireText>
            {bullets && <WireList items={bullets} />}
            {actions}
          </div>
          <WireImage label={imageLabel} ratio="21/9" />
        </RContainer>
      </RSection>
    );
  }

  const [textSpan, imageSpan] = split === "5-7" ? [5, 7] : split === "7-5" ? [7, 5] : [6, 6];
  return (
    <RSection size="xl" bg={bg}>
      <RContainer>
        <RGrid className="items-center">
          <RCol span={textSpan as 5 | 6 | 7} className="flex flex-col gap-6">
            <WireHeading level={1}>{title}</WireHeading>
            <WireText>{subtitle}</WireText>
            {bullets && <WireList items={bullets} />}
            {actions}
          </RCol>
          <RCol span={imageSpan as 5 | 6 | 7}>
            <WireImage label={imageLabel} ratio="4/3" />
          </RCol>
        </RGrid>
      </RContainer>
    </RSection>
  );
};

export const WireLogoBar = ({
  count = 6,
  label = "Trusted by teams everywhere",
}: {
  count?: number;
  label?: string;
}) => (
  <RSection size="sm" bg="white">
    <RContainer className="flex flex-col items-center gap-8">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <WireLogo key={i} />
        ))}
      </div>
    </RContainer>
  </RSection>
);

type LayoutSplit = "2-col" | "3-col" | "4-col" | "6-6" | "5-7" | "7-5" | "centered";

/**
 * General-purpose feature/content section.
 * Column splits render icon cards; side splits render text + image.
 */
export const WireLayout = ({
  split = "6-6",
  tagline = "Tagline",
  title = "A section heading that states one benefit",
  description = "A sentence or two expanding on the heading with concrete, plain language." as string | string[],
  items = 3,
  cards,
  imageLabel = "IMAGE",
  imageRight = true,
  bg = "white",
  buttons = 1,
  children,
}: {
  split?: LayoutSplit;
  tagline?: string;
  title?: string;
  /** One paragraph, or stacked short paragraphs (no text walls — max ~2 lines each). */
  description?: string | string[];
  items?: number;
  /** Real card content for column splits; overrides skeleton cards. */
  cards?: { title: string; body?: string }[];
  imageLabel?: string;
  imageRight?: boolean;
  bg?: SectionBg;
  buttons?: 0 | 1 | 2;
  /** Extra content under the text column of side splits. */
  children?: ReactNode;
}) => {
  const paragraphs = Array.isArray(description) ? description : [description];
  const descriptionBlock = (
    <div className="flex flex-col gap-3">
      {paragraphs.map((para, i) => (
        <WireText key={i}>{para}</WireText>
      ))}
    </div>
  );
  const actions = buttons > 0 && (
    <div className="flex flex-wrap items-center gap-4">
      <WireButton variant="secondary">Learn more</WireButton>
      {buttons > 1 && <WireButton variant="ghost">See details</WireButton>}
    </div>
  );

  if (split === "2-col" || split === "3-col" || split === "4-col") {
    const cols = split === "2-col" ? 6 : split === "3-col" ? 4 : 3; // col-span within 12-col grid
    const cardCount = cards ? cards.length : split === "2-col" ? Math.max(items, 2) : split === "3-col" ? Math.max(items, 3) : Math.max(items, 4);
    return (
      <RSection bg={bg}>
        <RContainer>
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
            {tagline && <p className="text-sm font-semibold text-gray-500">{tagline}</p>}
            <WireHeading level={2}>{title}</WireHeading>
            {descriptionBlock}
          </div>
          <RGrid>
            {Array.from({ length: cardCount }).map((_, i) => (
              <RCol key={i} span={cols as 3 | 4 | 6} className="flex flex-col items-start gap-4">
                <WireIcon />
                <WireHeading level={3}>{cards?.[i]?.title ?? "Feature name"}</WireHeading>
                {cards?.[i]?.body ? (
                  <WireText className="text-sm">{cards[i].body}</WireText>
                ) : (
                  <WireText lines={3} />
                )}
              </RCol>
            ))}
          </RGrid>
        </RContainer>
      </RSection>
    );
  }

  if (split === "centered") {
    return (
      <RSection bg={bg}>
        <RContainer>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            {tagline && <p className="text-sm font-semibold text-gray-500">{tagline}</p>}
            <WireHeading level={2}>{title}</WireHeading>
            {descriptionBlock}
            {actions}
          </div>
        </RContainer>
      </RSection>
    );
  }

  const [a, b] = split === "5-7" ? [5, 7] : split === "7-5" ? [7, 5] : [6, 6];
  const text = (
    <RCol span={a as 5 | 6 | 7} className="flex flex-col items-start gap-5">
      {tagline && <p className="text-sm font-semibold text-gray-500">{tagline}</p>}
      <WireHeading level={2}>{title}</WireHeading>
      {descriptionBlock}
      {children}
      {actions}
    </RCol>
  );
  const image = (
    <RCol span={b as 5 | 6 | 7}>
      <WireImage label={imageLabel} ratio="4/3" />
    </RCol>
  );
  return (
    <RSection bg={bg}>
      <RContainer>
        <RGrid className="items-center">
          {imageRight ? text : image}
          {imageRight ? image : text}
        </RGrid>
      </RContainer>
    </RSection>
  );
};

export const WireGallery = ({
  count = 6,
  cols = 3,
  title = "Recent work",
  bg = "white",
}: {
  count?: number;
  cols?: 2 | 3 | 4;
  title?: string;
  bg?: SectionBg;
}) => {
  const span = cols === 2 ? 6 : cols === 3 ? 4 : 3;
  return (
    <RSection bg={bg}>
      <RContainer>
        <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
          <WireHeading level={2}>{title}</WireHeading>
          <WireText lines={2} />
        </div>
        <RGrid>
          {Array.from({ length: count }).map((_, i) => (
            <RCol key={i} span={span as 3 | 4 | 6}>
              <WireImage label={`IMAGE ${i + 1}`} ratio="4/3" />
            </RCol>
          ))}
        </RGrid>
      </RContainer>
    </RSection>
  );
};

export const WireTestimonialSection = ({
  count = 3,
  title = "What customers say",
  bg = "light",
}: {
  count?: 1 | 2 | 3;
  title?: string;
  bg?: SectionBg;
}) => {
  if (count === 1) {
    return (
      <RSection bg={bg}>
        <RContainer className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <Stars />
          <blockquote className="text-xl font-semibold text-gray-800 md:text-2xl">
            "We rebuilt our entire site in a week. The team keeps finding new uses for it."
          </blockquote>
          <div className="flex flex-col items-center gap-1">
            <span className="mb-2 flex size-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[9px] font-medium tracking-widest text-gray-400">
              AV
            </span>
            <p className="text-sm font-semibold text-gray-900">Jamie Doe</p>
            <p className="text-sm text-gray-500">Product Lead, Acme Co</p>
          </div>
        </RContainer>
      </RSection>
    );
  }
  const span = count === 2 ? 6 : 4;
  return (
    <RSection bg={bg}>
      <RContainer>
        <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
          <WireHeading level={2}>{title}</WireHeading>
        </div>
        <RGrid>
          {Array.from({ length: count }).map((_, i) => (
            <RCol key={i} span={span as 4 | 6}>
              <WireTestimonialCard />
            </RCol>
          ))}
        </RGrid>
      </RContainer>
    </RSection>
  );
};

export const WirePricingSection = ({
  tiers = ["Starter", "Pro", "Enterprise"],
  highlight = 1,
  bg = "white",
  tagline = "Pricing",
  title = "Simple plans that scale with you",
  description,
  prices,
  blurbs,
  featureItems,
  chooseLabel = "Choose plan",
  chooseLabels,
  note,
}: {
  tiers?: string[];
  highlight?: number;
  bg?: SectionBg;
  /** Pass "" to hide (avoids a doubled label when the title already says Pricing). */
  tagline?: string;
  title?: string;
  /** One short line under the section title. */
  description?: string;
  /** Price line per tier (e.g. "$3,000/yr" or "Included"). */
  prices?: string[];
  /** Small line under a tier's price (e.g. "then $199/mo starting year 2"). */
  blurbs?: string[];
  /** Real feature bullets per tier; skeleton rows when omitted. */
  featureItems?: string[][];
  chooseLabel?: string;
  /** Per-tier button labels; overrides chooseLabel. */
  chooseLabels?: string[];
  note?: string;
}) => {
  const span = tiers.length === 2 ? 6 : 4;
  return (
    <RSection bg={bg}>
      <RContainer>
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
          {tagline && <p className="text-sm font-semibold text-gray-500">{tagline}</p>}
          <WireHeading level={2}>{title}</WireHeading>
          {description && <WireText>{description}</WireText>}
        </div>
        <RGrid className="md:justify-center">
          {tiers.map((tier, i) => (
            <RCol key={tier} span={span as 4 | 6}>
              <WireCard
                className={cn(
                  "flex h-full flex-col gap-6",
                  i === highlight && "border-gray-900",
                )}
              >
                <div className="flex flex-col gap-2">
                  <WireHeading level={3}>{tier}</WireHeading>
                  <p className="text-3xl font-bold text-gray-900">
                    {prices?.[i] ?? (
                      <>
                        $19<span className="text-sm font-normal text-gray-500">/mo</span>
                      </>
                    )}
                  </p>
                  {blurbs?.[i] && <p className="text-sm text-gray-500">{blurbs[i]}</p>}
                </div>
                {featureItems?.[i] ? (
                  <WireList items={featureItems[i]} />
                ) : (
                  <WireList count={4} />
                )}
                <WireButton
                  variant={i === highlight ? "primary" : "secondary"}
                  className="mt-auto w-full"
                >
                  {chooseLabels?.[i] ?? chooseLabel}
                </WireButton>
              </WireCard>
            </RCol>
          ))}
        </RGrid>
        {note && <p className="mt-8 text-center text-sm text-gray-400">{note}</p>}
      </RContainer>
    </RSection>
  );
};

export const WireCta = ({
  title = "Ready to get started?",
  description = "Create an account in minutes. Cancel anytime.",
  email = false,
  primaryLabel = "Get started",
  secondaryLabel = "Contact sales",
  primaryHref,
  secondaryHref,
  note,
  id,
  bg = "light",
}: {
  title?: string;
  description?: string;
  email?: boolean;
  primaryLabel?: string;
  /** Pass null to render a single button. */
  secondaryLabel?: string | null;
  /** Makes the primary button a link. Omit to keep it non-functional. */
  primaryHref?: string;
  /** Makes the secondary button a link. Omit to keep it non-functional. */
  secondaryHref?: string;
  /** Small reassurance line under the buttons. */
  note?: string;
  /** Anchor target for same-page links. */
  id?: string;
  bg?: SectionBg;
}) => (
  <RSection bg={bg} id={id}>
    <RContainer className="flex max-w-3xl flex-col items-center gap-6 text-center">
      <WireHeading level={2} className={bg === "dark" ? "text-white" : undefined}>
        {title}
      </WireHeading>
      <WireText className={bg === "dark" ? "text-gray-400" : undefined}>{description}</WireText>
      {email ? (
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <WireInput className="flex-1" />
          <WireButton href={primaryHref}>{primaryLabel}</WireButton>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          <WireButton href={primaryHref}>{primaryLabel}</WireButton>
          {secondaryLabel && (
            <WireButton variant="secondary" href={secondaryHref}>
              {secondaryLabel}
            </WireButton>
          )}
        </div>
      )}
      {note && <p className="text-sm text-gray-400">{note}</p>}
    </RContainer>
  </RSection>
);

/** Accordion-style FAQ. First item renders open; the rest render collapsed. */
export const WireFaq = ({
  title = "Frequently asked questions",
  description,
  items,
  openAll = false,
  note,
  id,
  bg = "white",
  children,
}: {
  title?: string;
  description?: string;
  items: { q: string; a?: string }[];
  /** Render every answer expanded, for explainer lists that are read, not clicked. */
  openAll?: boolean;
  /** Small closing line under the list. */
  note?: string;
  /** Anchor target for same-page links. */
  id?: string;
  bg?: SectionBg;
  /** Optional block under the list, for a recap table or summary rows. */
  children?: ReactNode;
}) => (
  <RSection bg={bg} id={id}>
    <RContainer className="max-w-3xl">
      <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
        <WireHeading level={2}>{title}</WireHeading>
        {description && <WireText>{description}</WireText>}
      </div>
      <div className="border-t border-gray-200">
        {items.map((item, i) => {
          const open = openAll || i === 0;
          return (
            <div key={item.q} className="border-b border-gray-200 py-5">
              <div className="flex items-center justify-between gap-6">
                <p className="font-semibold text-gray-900">{item.q}</p>
                <span className="text-xl leading-none text-gray-400">{open ? "−" : "+"}</span>
              </div>
              {open &&
                (item.a ? (
                  <WireText className="mt-3 text-sm">{item.a}</WireText>
                ) : (
                  <WireText lines={2} className="mt-4 max-w-xl" />
                ))}
            </div>
          );
        })}
      </div>
      {children && <div className="mt-10">{children}</div>}
      {note && <WireText className="mt-8 text-sm">{note}</WireText>}
    </RContainer>
  </RSection>
);

export const WireContact = ({
  title = "Get in touch",
  description = "Tell us a bit about your project and we will reply within one business day.",
  bg = "white",
}: {
  title?: string;
  description?: string;
  bg?: SectionBg;
}) => (
  <RSection bg={bg}>
    <RContainer className="max-w-2xl">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <WireHeading level={2}>{title}</WireHeading>
        <WireText>{description}</WireText>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WireInput placeholder="First name" />
          <WireInput placeholder="Last name" />
        </div>
        <WireInput placeholder="Email address" />
        <textarea
          placeholder="Message"
          rows={5}
          className="w-full border border-gray-300 bg-white p-3 text-sm text-gray-700 placeholder:text-gray-400"
        />
        <WireButton className="self-start">Send message</WireButton>
      </div>
    </RContainer>
  </RSection>
);

export const WireFooter = ({
  columns = [
    { title: "Product", links: ["Overview", "Features", "Pricing", "Changelog"] },
    { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
    { title: "Resources", links: ["Docs", "Help center", "Community", "Status"] },
  ],
  newsletter = true,
  sitemap,
  logo,
}: {
  columns?: { title: string; links: string[] }[];
  newsletter?: boolean;
  /** Single source of truth for columns, legal links, and logo. Overrides columns. */
  sitemap?: Sitemap;
  logo?: WireLogoSpec;
}) => {
  const cols: { title: string; links: (string | NavNode)[] }[] = sitemap?.footer
    ? sitemap.footer.map((c) => ({ title: c.title, links: c.links }))
    : columns;
  const legal = sitemap?.legal ?? ["Privacy", "Terms", "Cookies"];
  const logoSpec: WireLogoSpec =
    logo ?? sitemap?.logo ?? (sitemap ? { kind: "wordmark", text: sitemap.name } : { kind: "box" });
  return (
  <footer className="border-t border-gray-200 bg-white px-[5%] py-16 md:py-20">
    <RContainer>
      <RGrid className="mb-12 md:mb-16">
        <RCol span={4} className="flex flex-col gap-4">
          <WireLogoRender spec={logoSpec} href={sitemap?.home} />
          <WireText lines={2} className="max-w-56" />
        </RCol>
        {cols.map((col) => (
          <RCol key={col.title} span={2}>
            <p className="mb-4 text-sm font-semibold text-gray-900">{col.title}</p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => {
                const label = typeof link === "string" ? link : link.title;
                const path = typeof link === "string" ? undefined : link.path;
                return (
                  <li key={label} className="text-sm text-gray-500">
                    {path ? <a href={path}>{label}</a> : label}
                  </li>
                );
              })}
            </ul>
          </RCol>
        ))}
        {newsletter && (
          <RCol span={2}>
            <p className="mb-4 text-sm font-semibold text-gray-900">Subscribe</p>
            <div className="flex flex-col gap-3">
              <WireInput />
              <WireButton variant="secondary" size="sm">
                Subscribe
              </WireButton>
            </div>
          </RCol>
        )}
      </RGrid>
      <WireDivider className="mb-6" />
      <div className="flex flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">
        <p>© 2026 {sitemap?.name ?? "Company name"}. All rights reserved.</p>
        <div className="flex gap-6">
          {legal.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </RContainer>
  </footer>
  );
};
