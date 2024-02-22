import { MasksPipe } from './masks.pipe';

xdescribe('Caso de teste para máscara de CNPJ e CNO', () => {
  let pipe: MasksPipe;
  let mockCno: string;
  let mockCnoFormated: string;
  let mockTaxNumber: string;
  let mockTaxNumberFormated: string;

  beforeEach(() => {
    pipe = new MasksPipe();
  });

  mockTaxNumber = '53113791000122';
  mockTaxNumberFormated = '53.113.791/0001-22';

  mockCno = '531137910122';
  mockCnoFormated = '53.113.79101/22';

  it('deve retornar um valor de 14 caracteres formatados com a máscara de CNPJ (XX.XXX.XXX/YYYY-ZZ)', () => {
    expect(pipe.transform(mockTaxNumber)).toBe(mockTaxNumberFormated);
  });

  it('deve retornar um valor de 12 caracteres formatados com a máscara de mockCno (XX.XXX.XXXXX/YY)', () => {
    expect(pipe.transform(mockCno)).toBe(mockCnoFormated);
  });
});
