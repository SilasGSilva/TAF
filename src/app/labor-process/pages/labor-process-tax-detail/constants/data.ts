export const COLUMNS = [
  {
    label: 'CPF',
    property: 'cpfTrab',
    width: '25%',
  },
  {
    label: 'Nome',
    property: 'nmTrab',
    width: '60%',
  },
  {
    label: 'Data de nascimento',
    property: 'dtNascto',
    width: '15%',
    type: 'date',
  },
];

export const COLUMNS_V1 = [
  {
    label: 'CPF',
    property: 'cpfTrab',
    width: '20%',
  },
  {
    label: 'Nome',
    property: 'nmTrab',
    width: '60%',
  },
  {
    label: 'Data de nascimento',
    property: 'dtNascto',
    width: '15%',
    type: 'date',
  },
  {
    label: 'OK',
    type: 'icon',
    property: 'hasCalculationPeriod',
    width: '5%',
    icons: [
      {
        value: 'hasValidPeriod',
        icon: 'po-icon-ok',
        color: 'color-10',
        tooltip: 'Foram cadastrados periodos de pagamento para este trabalhador'
      },
      {
        value: "hasNoValidPeriod",
        icon: 'po-icon-close',
        color: 'color-07',
        tooltip: 'Não foi cadastrado nenhum período de pagamento para este trabalhador'
      }],
  },
];
