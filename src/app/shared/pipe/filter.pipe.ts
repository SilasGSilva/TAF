import { Pipe, PipeTransform } from '@angular/core';
import { PipeSearchFields } from './../../models/pipe-search-fields';

@Pipe({ name: 'filterPipe' })
export class FilterPipe implements PipeTransform {
  transform(
    itemsTableArray: Array<PipeSearchFields>,
    stringInput: string
  ): Array<PipeSearchFields> {
    const searchFields = Object.keys(new PipeSearchFields());
    const arrayReturn: Array<PipeSearchFields> = [];

    stringInput = stringInput.trim().toLowerCase().replace(/[.-]/g,"");

    for (let i = 0; i < itemsTableArray?.length; i++) {
      for (const field of searchFields) {
        if (itemsTableArray[i].hasOwnProperty(field) && itemsTableArray[i][field].toLowerCase().replace(/[.-]/g,"").indexOf(stringInput) !== -1) {
          arrayReturn.push(itemsTableArray[i]);
          break;
        }
      }
    }

    return arrayReturn;
  }
}
