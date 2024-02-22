import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masks'
})

export class MasksPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    } else if (value.trim().length === 12) {
      return this.cno(value);
    } else if (value.trim().length === 11) {
      return this.cpf(value);
    } else if (value.trim().length === 8) {
      return this.shortCnpj(value);
    } else {
      return this.cnpj(value);
    }
  }

  public cno(value: string): string {
      return value.replace(/(\d{2})(\d{3})(\d{5})(\d{2})/g, '\$1.\$2.\$3\/\$4');
  }

  public cnpj(value: string): string {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
  }

  public shortCnpj(value: string): string {
    return value.replace(/(\d{2})(\d{3})(\d{3})/g, '\$1.\$2.\$3');
  }

  public cpf(value: string): string {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
  }

}
