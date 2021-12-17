import { Injectable } from '@angular/core';

// @ts-ignore
import * as JSZip from 'jszip';
/*import { saveAs } from 'file-saver';*/
declare const docxtemplater: any;

@Injectable({
  providedIn: 'root',
})
export class SaveFilesService {
  constructor() {}

  save(zipContent: any, data: any[]): void {
    const zip = new JSZip();

    data.forEach((val) => {
      const file = this.generate(zipContent, val);
      zip.file(`Word_${val.docNr}.docx`, file);
    });

    zip.generateAsync({ type: 'blob' }).then((content: any) => {
      console.log(content)
    });
  }

  generate(zip: any, val: any): any {
    const doc = new docxtemplater(zip).setData(val).render();
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    return out;
  }
}
