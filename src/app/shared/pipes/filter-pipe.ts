import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchText: string): any {
    let result:any[] = value;
    if (searchText) {
      result = result.filter((autoPart: any) => {
        if(autoPart.name) {
          return autoPart.name && autoPart.name.toLowerCase().includes(searchText.toLowerCase())
        }
        else if (autoPart.autoPart) {
          return autoPart.autoPart.name && autoPart.autoPart.name.toLowerCase().includes(searchText.toLowerCase())
        }
        else console.log(autoPart);
      })


    }
    return result;
  }


}
