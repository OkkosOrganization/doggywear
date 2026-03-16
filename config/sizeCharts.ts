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
  shirtImageSrc: string;
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
};

export const getSizeChart = (baseModel?: string | null): SizeChart | null => {
  if (!baseModel) return null;
  return SIZE_CHARTS_BY_BASE_MODEL[baseModel] || null;
};
