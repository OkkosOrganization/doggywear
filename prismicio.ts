import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

import config from './slicemachine.config.json';

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'frontpage',
    path: '/',
  },
  {
    type: 'infopage',
    path: '/info',
  },
  {
    type: 'product',
    path: '/product/:uid',
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions: {
      cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
    },
    ...config,
  });
  enableAutoPreviews({ client });

  return client;
};
