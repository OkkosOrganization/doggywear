import { INSTAGRAM_URL } from '../config/env';

type NaviItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const getNaviItems = (): NaviItem[] => [
  {
    label: `HOME`,
    href: `/`,
  },
  {
    label: 'INFO',
    href: `/info`,
  },
  {
    label: 'INSTAGRAM',
    href: INSTAGRAM_URL,
    external: true,
  },
];
