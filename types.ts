declare global {
  interface Window {
    localStorage: unknown;
  }
  interface Navigator {
    msMaxTouchPoints?: unknown;
  }
}

export type Locale = {
  locale:string;
  prismicLocale: string;
  menuLabel: string;
  path:string;
  url:string;
}