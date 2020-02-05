export const SLOTypes: Array<SLOType> = [
  { text: 'Must be equal to', type: 'EqualTo', symbol: '==', id: 0 },
  { text: 'Must not be equal to', type: 'NotEqualTo', symbol: '!=', id: 1 },
  { text: 'Must be smaller than', type: 'SmallerThan', symbol: '<', id: 2 },
  {
    text: 'Must be smaller or equal to',
    type: 'SmallerOrEqualTo',
    symbol: '<=',
    id: 3
  },
  { text: 'Must be greater than', type: 'GreaterThan', symbol: '>', id: 4 },
  {
    text: 'Must be greater than or equal to',
    type: 'GreaterOrEqualTo',
    symbol: '>=',
    id: 5
  }
];

export function typeIdToTypeName(id: number) {
  const sloType: SLOType | undefined = SLOTypes.find(slo => {
    return slo.id === id;
  });

  if (sloType) {
    return sloType.type;
  }
}

export function typeIdToTypeText(id: number) {
  const sloType: SLOType | undefined = SLOTypes.find(slo => {
    return slo.id === id;
  });

  if (sloType) {
    return sloType.text;
  }
}

export function typeIdToTypeSymbol(id: number) {
  const sloType: SLOType | undefined = SLOTypes.find(slo => {
    return slo.id === id;
  });

  if (sloType) {
    return sloType.symbol;
  }
}

declare global {
  interface SLOType {
    id: number;
    text: string;
    symbol: string;
    type: string;
  }
}
