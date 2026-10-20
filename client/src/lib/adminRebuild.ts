import { supabase } from './supabase';

/**
 * Asks the server to re-capture the prerendered snapshots after a Services/Fleet
 * edit, so non-JS crawlers see the change without waiting for the next deploy.
 * Real visitors already see it immediately regardless (the client always remounts
 * and refetches live data — this is purely about what a crawler reading raw HTML
 * sees in the meantime).
 *
 * Deliberately fire-and-forget: never throws, never blocks the caller. A failed or
 * slow rebuild must not get in the way of the actual save/delete the admin cares
 * about — worst case, the snapshot stays as it was until the next deploy or a
 * later edit retriggers this.
 */
export function triggerPrerenderRebuild(): void {
  (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      await fetch('/admin/rebuild-prerender', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('[admin] prerender rebuild trigger failed:', error);
    }
  })();
}
