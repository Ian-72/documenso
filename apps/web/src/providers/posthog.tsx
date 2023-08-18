'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { getSession } from 'next-auth/react';
import posthog from 'posthog-js';

import { extractPostHogConfig } from '@documenso/lib/constants/feature-flags';

export function PostHogPageview(): JSX.Element {
  const postHogConfig = extractPostHogConfig();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (typeof window !== 'undefined' && postHogConfig) {
    posthog.init(postHogConfig.key, {
      api_host: postHogConfig.host,
      loaded: () => {
        getSession()
          .then((session) => {
            if (session) {
              posthog.identify(session.user.email ?? session.user.id.toString());
            } else {
              posthog.reset();
            }
          })
          .catch(() => {
            // Do nothing.
          });
      },
    });
  }

  useEffect(() => {
    if (!postHogConfig || !pathname) {
      return;
    }

    let url = window.origin + pathname;
    if (searchParams && searchParams.toString()) {
      url = url + `?${searchParams.toString()}`;
    }
    posthog.capture('$pageview', {
      $current_url: url,
    });
  }, [pathname, searchParams, postHogConfig]);

  return <></>;
}