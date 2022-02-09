import { Locales } from './locales';

const translations = {
  ADD_TO_CART: {
    en: 'Add to cart',
    fi: 'Lisää koriin',
  },
  CHECKOUT: {
    en: 'Checkout',
    fi: 'Kassalle',
  },
  OUT_OF_STOCK: {
    en: 'Out of stock',
    fi: 'Loppu varastosta',
  },
  CALCULATED_AT_THE_NEXT_STEP: {
    en: 'Calculated at the next step',
    fi: 'Lasketaan seuraavassa vaiheessa',
  },
  SHOP_NOW: {
    en: 'Shop now',
    fi: 'Osta',
  },
  SHOW_ALL: {
    en: 'Show all',
    fi: 'Näytä kaikki',
  },
  SHOW_LESS: {
    en: 'Show less',
    fi: 'Näytä vähemmän',
  },
};

export const getTranslation = (
  key: string,
  lang: string = Locales[0].locale
): string => {
  if (
    translations.hasOwnProperty(key) &&
    translations[key].hasOwnProperty(lang)
  )
    return translations[key][lang];
  else return key;
};
