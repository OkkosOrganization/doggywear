export type SizeChartRow = {
  size: string;
  widthCm: string;
  widthInch: string;
  lengthCm: string;
  lengthInch: string;
};

export type SizeChartUnit = 'cm' | 'inch';

export type SizeChart = {
  modelName: string;
  shirtImageSrc?: string;
  rows: SizeChartRow[];
};

const SIZE_CHARTS_BY_BASE_MODEL: Record<string, SizeChart> = {
  'Earth Positive EP19': {
    modelName: 'EP19 Earth Positive Oversized T-shirt',
    shirtImageSrc: '/size_charts/EP19-shirt.png',
    rows: [
      {
        size: 'XS',
        widthCm: '51',
        widthInch: '20',
        lengthCm: '73',
        lengthInch: '28 3/4',
      },
      {
        size: 'S',
        widthCm: '54',
        widthInch: '21 1/4',
        lengthCm: '75',
        lengthInch: '29 1/2',
      },
      {
        size: 'M',
        widthCm: '57',
        widthInch: '22 1/2',
        lengthCm: '77',
        lengthInch: '30 1/4',
      },
      {
        size: 'L',
        widthCm: '60',
        widthInch: '23 3/4',
        lengthCm: '79',
        lengthInch: '31',
      },
      {
        size: 'XL',
        widthCm: '63',
        widthInch: '24 3/4',
        lengthCm: '81',
        lengthInch: '32',
      },
      {
        size: '2XL',
        widthCm: '66',
        widthInch: '26',
        lengthCm: '83',
        lengthInch: '32 3/4',
      },
      {
        size: '3XL',
        widthCm: '69',
        widthInch: '27 1/4',
        lengthCm: '85',
        lengthInch: '33 1/2',
      },
    ],
  },
  'Earth Positive EP185L': {
    modelName: 'EP185L Earth Positive Premium Long Sleeve T-shirt',
    shirtImageSrc: '/size_charts/EP185L-shirt.png',
    rows: [
      {
        size: 'XS',
        widthCm: '47',
        widthInch: '18 1/2',
        lengthCm: '68',
        lengthInch: '26 3/4',
      },
      {
        size: 'S',
        widthCm: '50',
        widthInch: '19 3/4',
        lengthCm: '70',
        lengthInch: '27 1/2',
      },
      {
        size: 'M',
        widthCm: '53',
        widthInch: '20 3/4',
        lengthCm: '72',
        lengthInch: '28 1/2',
      },
      {
        size: 'L',
        widthCm: '56',
        widthInch: '22',
        lengthCm: '74',
        lengthInch: '29 1/4',
      },
      {
        size: 'XL',
        widthCm: '60',
        widthInch: '23 1/2',
        lengthCm: '76',
        lengthInch: '30',
      },
      {
        size: '2XL',
        widthCm: '64',
        widthInch: '25',
        lengthCm: '78',
        lengthInch: '30 3/4',
      },
      {
        size: '3XL',
        widthCm: '68',
        widthInch: '26 3/4',
        lengthCm: '80',
        lengthInch: '31 1/2',
      },
    ],
  },
  'Earth Positive EP185': {
    modelName: 'EP185 Earth Positive Premium Jersey T-shirt',
    shirtImageSrc: '/size_charts/EP185-shirt.png',
    rows: [
      {
        size: 'XS',
        widthCm: '47',
        widthInch: '18 1/2',
        lengthCm: '68.5',
        lengthInch: '27',
      },
      {
        size: 'S',
        widthCm: '50',
        widthInch: '19 3/4',
        lengthCm: '70',
        lengthInch: '27 1/2',
      },
      {
        size: 'M',
        widthCm: '53',
        widthInch: '20 3/4',
        lengthCm: '72',
        lengthInch: '28 1/4',
      },
      {
        size: 'L',
        widthCm: '56',
        widthInch: '22',
        lengthCm: '74',
        lengthInch: '29 1/4',
      },
      {
        size: 'XL',
        widthCm: '60',
        widthInch: '23 1/2',
        lengthCm: '76',
        lengthInch: '30',
      },
      {
        size: '2XL',
        widthCm: '64',
        widthInch: '25 1/4',
        lengthCm: '78',
        lengthInch: '30 3/4',
      },
      {
        size: '3XL',
        widthCm: '68',
        widthInch: '26 3/4',
        lengthCm: '80',
        lengthInch: '31 1/2',
      },
    ],
  },
  'Earth Positive EP38': {
    modelName: 'EP38 Earth Positive Heavy T-shirt',
    shirtImageSrc: '/size_charts/EP38-shirt.png',
    rows: [
      {
        size: 'XS',
        widthCm: '48.5',
        widthInch: '18 3/4',
        lengthCm: '68',
        lengthInch: '26 3/4',
      },
      {
        size: 'S',
        widthCm: '51.5',
        widthInch: '20 1/4',
        lengthCm: '70',
        lengthInch: '27 1/2',
      },
      {
        size: 'M',
        widthCm: '54.5',
        widthInch: '21 1/2',
        lengthCm: '72',
        lengthInch: '28 1/4',
      },
      {
        size: 'L',
        widthCm: '57.5',
        widthInch: '22 1/2',
        lengthCm: '74',
        lengthInch: '29 1/4',
      },
      {
        size: 'XL',
        widthCm: '60.5',
        widthInch: '23 3/4',
        lengthCm: '76',
        lengthInch: '30',
      },
      {
        size: '2XL',
        widthCm: '63.5',
        widthInch: '25',
        lengthCm: '78',
        lengthInch: '30 3/4',
      },
      {
        size: '3XL',
        widthCm: '66.5',
        widthInch: '26 1/4',
        lengthCm: '80',
        lengthInch: '31 1/2',
      },
    ],
  },
  'Gildan 2400 Ultra Cotton long sleeve': {
    modelName: 'Gildan 2400 Ultra Cotton long sleeve',
    rows: [
      {
        size: 'S',
        widthCm: '45.7',
        widthInch: '18',
        lengthCm: '71.1',
        lengthInch: '28',
      },
      {
        size: 'M',
        widthCm: '50.8',
        widthInch: '20',
        lengthCm: '73.7',
        lengthInch: '29',
      },
      {
        size: 'L',
        widthCm: '55.9',
        widthInch: '22',
        lengthCm: '76.2',
        lengthInch: '30',
      },
      {
        size: 'XL',
        widthCm: '61',
        widthInch: '24',
        lengthCm: '78.7',
        lengthInch: '31',
      },
      {
        size: '2XL',
        widthCm: '66',
        widthInch: '26',
        lengthCm: '81.3',
        lengthInch: '32',
      },
      {
        size: '3XL',
        widthCm: '71.1',
        widthInch: '28',
        lengthCm: '83.8',
        lengthInch: '33',
      },
      {
        size: '4XL',
        widthCm: '76.2',
        widthInch: '30',
        lengthCm: '86.4',
        lengthInch: '34',
      },
      {
        size: '5XL',
        widthCm: '81.3',
        widthInch: '32',
        lengthCm: '88.9',
        lengthInch: '35',
      },
    ],
  },
};

export const getSizeChart = (baseModel?: string | null): SizeChart | null => {
  if (!baseModel) return null;
  if (baseModel === 'Unknown') return null;
  return SIZE_CHARTS_BY_BASE_MODEL[baseModel] || null;
};
