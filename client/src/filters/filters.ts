import numeral from 'numeral';

const formatJSON = (value: number): any => {
  return JSON.stringify(value);
};

const formatSLO = (slo: number): number => {
  return slo / 1000;
};

const formatMetric = (metricValue: number, metricFormat: string): any => {
  return numeral(metricValue).format(metricFormat);
};

const truncateText = (text: string, length: number, suffix: string): string => {
  if (text.length > length) {
    return text.substring(0, length) + suffix;
  } else {
    return text;
  }
};

const roundNumber = (value: number, decimals: number): number => {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return value;
};

export default {
  formatJSON,
  formatSLO,
  formatMetric,
  truncateText,
  roundNumber
};
