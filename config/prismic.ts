import Prismic from '@prismicio/client';
import { PRISMIC_API_ENDPOINT } from './env';

const apiEndPoint = PRISMIC_API_ENDPOINT;
const accessToken =  null;

const linkResolver = (doc, lang) => {
  return '/';
};

export {apiEndPoint, Prismic, linkResolver};
