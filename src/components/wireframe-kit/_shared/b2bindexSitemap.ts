/**
 * b2bindexSitemap.ts: one Sitemap shared by every B2Bindex page, so the
 * navbar and footer can never disagree across Home / Category / Company /
 * Compare / Article. Structure only; page copy lives in the gated decks in copy/.
 *
 * Every href goes through wfHref so it respects the deploy base
 * (import.meta.env.BASE_URL): "/" locally, "/b2b-index/" on the deployed site.
 */
import type { Sitemap } from "./Wire";

/** Absolute href for a registered wireframe page, base-aware. */
export const wfHref = (page: string) => `${import.meta.env.BASE_URL}${page}`;

export const B2B_HOME = import.meta.env.BASE_URL;
export const B2B_CATEGORY = wfHref("B2BIndexCategory");
export const B2B_COMPANY = wfHref("B2BIndexCompany");
export const B2B_COMPARE = wfHref("B2BIndexCompare");
export const B2B_ARTICLE = wfHref("B2BIndexArticle");

/** One company profile. The page reads ?company=<slug> off the query string. */
export const companyHref = (slug: string) => B2B_COMPANY + "?company=" + slug;

/** One head-to-head. The page reads ?a=<slug>&b=<slug> off the query string. */
export const compareHref = (a: string, b: string) => B2B_COMPARE + "?a=" + a + "&b=" + b;

export const b2bindex: Sitemap = {
  name: "B2Bindex",
  logo: { kind: "wordmark", text: "B2Bindex" },
  home: B2B_HOME,
  main: [
    { title: "Categories", path: B2B_CATEGORY },
    { title: "Compare", path: B2B_COMPARE },
    { title: "Articles", path: B2B_ARTICLE },
  ],
  ctas: ["Claim your brand"],
  ctaLinks: [B2B_COMPANY],
  footer: [
    {
      title: "Categories",
      links: [
        { title: "Digital & AI Marketing", path: B2B_CATEGORY },
        { title: "SaaS" },
        { title: "Cybersecurity" },
        { title: "Fintech" },
      ],
    },
    {
      title: "Coverage",
      links: [
        { title: "Compare", path: B2B_COMPARE },
        { title: "B2B trends", path: B2B_ARTICLE },
        { title: "B2B data", path: B2B_ARTICLE },
        { title: "All articles", path: B2B_ARTICLE },
      ],
    },
    {
      title: "Company",
      links: [
        { title: "About" },
        { title: "Claim your brand", path: B2B_COMPANY },
        { title: "Request a listing", path: B2B_COMPANY },
        { title: "Contact" },
      ],
    },
  ],
  legal: ["Privacy", "Terms"],
};
