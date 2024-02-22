const tafCompany = {
  company_code: 'T1',
  branch_code: 'D MG 01 ',
};
const tafFeatures = {
  downloadXLS: { access: true, message: 'RGlzcG9u7XZlbC4=' },
  tsiStamp: { access: true, message: 'RGlzcG9u7XZlbC4=' },
};
const tafContext = 'reinf';
const tafTsi = 'tsi';
const tafSv = 'smartview';
const tafFull = true;

sessionStorage.setItem('TAFCompany', JSON.stringify(tafCompany));
sessionStorage.setItem('TAFFeatures', JSON.stringify(tafFeatures));
sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
sessionStorage.setItem('TAFContext', tafContext);
sessionStorage.setItem('TAFTsi', tafTsi);
sessionStorage.setItem('TAFSv', tafSv);