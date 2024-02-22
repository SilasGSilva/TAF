export const COLUMNS_V1 = [
  {
    label: 'Periodo',
    property: 'periodoReferenciaLabel',
    width: '8%',
  },
  {
    label: 'Base da contribuição mensal',
    property: 'baseContribMensalLabel',
    width: '23%',
    type: 'currency',
    format: 'BRL'
  },
  {
    label: 'Base da contribuição mensal 13º',
    property: 'baseContribMensal13Label',
    width: '23%',
    type: 'currency',
    format: 'BRL'
  },
  {
    label: 'Rendimento tributavel do IRRF',
    property: 'rendimentoTribIRRFLabel',
    width: '23%',
    type: 'currency',
    format: 'BRL'
  },
  {
    label: 'Rendimento tributavel do IRRF do 13º',
    property: 'rendimentoTribIRRF13Label',
    width: '23%',
    type: 'currency',
    format: 'BRL'
  },
];

export const COLUMNS_NOT_V1 = [
  {
    label: 'Periodo',
    property: 'periodoReferenciaLabel',
    width: '10%',
  },
  {
    label: 'Base da contribuição mensal',
    property: 'baseContribMensalLabel',
    width: '40%',
    type: 'currency',
    format: 'BRL'
  },
  {
    label: 'Base da contribuição mensal 13º',
    property: 'baseContribMensal13Label',
    width: '40%',
    type: 'currency',
    format: 'BRL'
  },
];
