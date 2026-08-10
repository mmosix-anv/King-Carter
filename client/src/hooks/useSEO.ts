import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { seoConfig, resolvePageSEO, type PageSEO } from '@shared/seo';

type JsonLd = Record<string, unknown>;

interface UseSEOOptions extends Partial<PageSEO> {
  type?: string;
  /** Page-level structured data, added alongside the site-wide LocalBusiness graph. */
  schema?: JsonLd | JsonLd[];
  /** Skip the effect while async page data is still loading. */
  ready?: boolean;
}

/**
 * Sets the document title, meta tags, canonical URL and JSON-LD for the current route.
 *
 * With no arguments the hook resolves everything from `pageSEO` using the current
 * path, so most pages only need `useSEO()`. Pass overrides for pages whose metadata
 * depends on fetched data (service pages).
 */
export const useSEO = (options: UseSEOOptions = {}) => {
  const [location] = useLocation();
  const fromMap = resolvePageSEO(location);

  const title = options.title ?? fromMap?.title ?? seoConfig.defaultTitle;
  const description = options.description ?? fromMap?.description ?? seoConfig.defaultDescription;
  const keywords = options.keywords ?? fromMap?.keywords ?? seoConfig.keywords.join(', ');
  const image = options.image ?? fromMap?.image ?? seoConfig.defaultImage;
  const noindex = options.noindex ?? fromMap?.noindex ?? false;
  const type = options.type ?? 'website';
  const ready = options.ready ?? true;
  const schema = options.schema;

  const canonical = `${seoConfig.siteUrl}${location === '/' ? '/' : location.replace(/\/$/, '')}`;
  // Serialized so inline schema literals do not re-run the effect on every render.
  const schemaJson = schema ? JSON.stringify(schema) : undefined;

  useEffect(() => {
    if (!ready) return;

    document.title = title;

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    setMeta('author', seoConfig.author);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('googlebot', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', seoConfig.siteName, 'property');
    setMeta('og:locale', 'en_US', 'property');
    setMeta('og:image', image, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', seoConfig.twitterHandle);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    setLink('canonical', canonical);

    setJsonLd('seo-organization', JSON.stringify(seoConfig.organization));
    setJsonLd('seo-page', schemaJson);
  }, [ready, title, description, keywords, image, noindex, type, canonical, schemaJson]);
};

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

/**
 * Writes (or clears) a JSON-LD block. Each block owns its own <script> via `id`, so
 * page-specific schema never overwrites the site-wide organization graph.
 */
function setJsonLd(id: string, json: string | undefined) {
  const existing = document.getElementById(id);

  if (!json) {
    existing?.remove();
    return;
  }

  const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
  script.id = id;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = json;
  if (!existing) document.head.appendChild(script);
}

export default useSEO;
