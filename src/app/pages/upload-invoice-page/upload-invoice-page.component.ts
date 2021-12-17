import {Component, OnInit, Injectable, ViewChild, ElementRef} from '@angular/core';
import * as XLSX from 'xlsx';
import Docxtemplater from "docxtemplater";
// @ts-ignore
import * as JSZip from 'jszip';
// @ts-ignore
import PizZip from "pizzip";
import {InvoiceService} from "../../shared/services/invoice/invoice.service";
import {SaveFilesService} from "../../shared/services/readWordFiles/save-files.service";


@Component({
  selector: 'upload-invoice-page',
  templateUrl: './upload-invoice-page.component.html',
  styleUrls: ['./upload-invoice-page.component.css']
})
@Injectable()
export class UploadInvoicePageComponent {
  title = 'upload-invoice-page';

  uploadedInvoices: any = [];
  isPageSpinnerOn: boolean = false
  ownerEmptyError: boolean = false
  serverErrorMessage: string = ""
  successMessage: string = ""

  constructor(public invoiceService: InvoiceService, public filesService: SaveFilesService) {

  }

  /*

    onWordUpload(event:any) {
      var zipFile = new JSZip();
      var zip = zipFile.loadFilesAsync(event.target.files[0]);
      var doc=new Docxtemplater().loadZip(zip)
      var text= doc.getFullText();
      console.log(text);
    }
  */

  readDocxFile(file: any): void {
    const reader = new FileReader();


    reader.readAsBinaryString(file);

    reader.onerror = (event) => {
      console.log('error reading file', event);
    };

    reader.onload = (event) => {
      const content = event.target && event.target.result;
      const zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip)
      var text = doc.getFullText();
      console.log(text)
      this.extractInfoFromWordDocument(text)
    };
  }

  extractInfoFromWordDocument(text: string) {
    let invoiceDocumentType: string = ""
    let invoiceDocumentTypeExtracted: boolean = false
    let invoiceNumber: string = ""
    let invoiceNumberExtracted: boolean = false
    let registrationNumber: string = ""
    let registrationNumberExtracted: boolean = false
    let brand: string = ""
    let brandExtracted: boolean = false
    let type: string = ""
    let typeExtracted: boolean = false
    let manufacturingYear: string = ""
    let manufacturingYearExtracted: boolean = false
    let engineNumber: string = ""
    let engineNumberExtracted: boolean = false
    let chassisNumber: string = ""
    let chassisNumberExtracted: boolean = false
    let kw: string = ""
    let kwExtracted: boolean = false
    let owner: string = ""
    let ownerExtracted: boolean = false
    let address: string = ""
    let addressExtracted: boolean = false
    let emb: string = ""
    let embExtracted: boolean = false
    let km: string = ""
    let kmExtracted: boolean = false
    let date: string = ""
    let partsExtracted: boolean = false
    let totalExtracted: boolean = false

    let partNamesInDocuments: any = [];
    let indexForPartsInDocument: number = 1
    let invoiceTotal: any = ""
    let labour: any = ""

    text = text.trim();
    for (let i: number = 0; i < text.length; i++) {

      if (!invoiceDocumentTypeExtracted) {
        if ("abcdefghijklmnopqrstuvwxyz -".includes(text[i].toLowerCase())) {
          invoiceDocumentType += text[i];
        } else  {
          invoiceDocumentTypeExtracted = true;
          invoiceDocumentType = invoiceDocumentType.trim()
          if(invoiceDocumentType.toLowerCase().includes('лог') || invoiceDocumentType.toLowerCase().includes('log')) invoiceDocumentType = 'warrant'
          if(invoiceDocumentType.toLowerCase().includes('фак') || invoiceDocumentType.toLowerCase().includes('fak') ) invoiceDocumentType = 'invoice'
          if(invoiceDocumentType.toLowerCase().includes('пон') || invoiceDocumentType.toLowerCase().includes('pon')) invoiceDocumentType = 'offer'
        }
      }
      if (invoiceDocumentTypeExtracted && !invoiceNumberExtracted) {
        if (!"abcdefghijklmnopqrstuvwxyz -".includes(text[i].toLowerCase())) {
          invoiceNumber += text[i];
        } else if (invoiceNumber) invoiceNumberExtracted = true;
      }
      if (invoiceNumberExtracted && !registrationNumberExtracted) {
        if (text[i] === "T" && text[i + 1] === "o" && text[i + 2] === "v") registrationNumberExtracted = true;
        else if (text[i] === "V" && text[i + 1] === "o" && text[i + 2] === "z") registrationNumberExtracted = true;
        else if (text[i] === "P" && text[i + 1] === "a" && text[i + 2] === "t") registrationNumberExtracted = true;
        else {
          if (text[i] !== " ") {
            registrationNumber += text[i];
          }
        }
      }
      if (registrationNumberExtracted && !brandExtracted) {
        if (text[i] === "T" && text[i + 1] === "i" && text[i + 2] === "p") {
          brand = brand.trim();
          brandExtracted = true;
        } else {
          brand += text[i];
          if (text[i] === ":") brand = ""
        }
      }
      if (brandExtracted && !typeExtracted) {
        if (text[i] === "G" && text[i + 1] === "o" && text[i + 2] === "d") {
          type = type.trim();
          typeExtracted = true;
        } else {
          type += text[i];
          if (text[i] === ":") type = ""
        }
      }
      if (typeExtracted && !manufacturingYearExtracted) {
        if (text[i] === "Z" && text[i + 1] === "a" && text[i + 2] === "f") {
          manufacturingYear = manufacturingYear.trim();
          manufacturingYearExtracted = true;
        } else {
          manufacturingYear += text[i];
          if (text[i] === ":") manufacturingYear = ""
        }
      }
      /*else if (manufacturingYearExtracted && !engineNumberExtracted) {
        if (text[i] === "B" && text[i + 1] === "r") {
          engineNumber = engineNumber.trim();
          engineNumberExtracted = true;
        } else {
          engineNumber += text[i];
          if (text[i] === ":") engineNumber = ""
        }
      }
      if (engineNumberExtracted && !chassisNumberExtracted) {
        if (text[i] === "K" && text[i + 1] === "W" && text[i + 2] === ":") {
          chassisNumber = chassisNumber.trim();
          chassisNumberExtracted = true;
        } else {
          chassisNumber += text[i];
          if (text[i] === ":") chassisNumber = ""
        }
      }
      if (chassisNumberExtracted && !kwExtracted) {
        if (text[i] === "S" && text[i + 1] === "o" && text[i + 2] === "p") {
          kw = kw.trim();
          kwExtracted = true;
        } else {
          kw += text[i];
          if (text[i] === ":") kw = ""
        }
      }*/
      if (manufacturingYearExtracted && !ownerExtracted) {
        if (text[i].toLowerCase() === "k" && text[i + 1].toLowerCase() === "m" && text[i + 2] === ":") {
          owner = owner.trim();
          ownerExtracted = true;
        } else {
          owner += text[i];
          if (text[i] === ":") owner = ""
        }
      }
/*      if (ownerExtracted && !addressExtracted) {
        if (text[i] === "E" && text[i + 1] === "M" && text[i + 2] === "B") {
          address = address.trim();
          addressExtracted = true;
        } else {
          address += text[i];
          if (text[i] === ":") address = ""
        }
      }
      if (addressExtracted && !embExtracted) {
        if (text[i] === "K" && text[i + 1] === "M" && text[i + 2] === ":") {
          emb = emb.trim();
          embExtracted = true;
        } else {
          emb += text[i];
          if (text[i] === ":") emb = ""
        }
      }*/
      if (ownerExtracted && !kmExtracted) {
        if (text[i] === "B" && text[i + 1] === "r" && text[i + 2] === ".") {
          km = km.trim();
          kmExtracted = true;
        } else {
          km += text[i];
          if (text[i] === ":") km = ""
        }
      }


      if (kmExtracted) {
        for (let j: number = i; j < text.length; j++) {
          let newPartName: string = ""
          if (text[j - 2] === indexForPartsInDocument.toString() && text[j - 1] === ".") {
            for (let indexForName: number = j; indexForName < text.length; indexForName++) {
              if(newPartName.toLowerCase().includes('raka')) {
                for(let indexForLabour: number = indexForName; indexForLabour < indexForName + 20; indexForLabour++) {
                  if(text[indexForLabour] === ',') {
                    labour = labour.trim()
                    break;
                  }
                  labour += text[indexForLabour]
                }
              }
              if ("0123456789".includes(text[indexForName].toString()) || (text[indexForName].toLowerCase() === 'v'
                && text[indexForName+1].toLowerCase() === 'k' && text[indexForName+2].toLowerCase() === 'u' && text[indexForName+4].toLowerCase() === 'p')) {
                j = indexForName;
                break
              }
              newPartName += text[indexForName];
            }
          if(!newPartName.toLowerCase().includes('raka')) {
            partNamesInDocuments.push({
              name: newPartName.trim()
            });
          }

            indexForPartsInDocument++;
          }
        }
        partsExtracted = true;
      }

      if (partsExtracted && text[i - 1] === ":") {
        let vkupnoString: string = ""
        let numberOfLettersInVkupno: number = 20
        while (numberOfLettersInVkupno > 1) {
          if (text[i - numberOfLettersInVkupno] && text[i - numberOfLettersInVkupno] !== " ") vkupnoString += text[i - numberOfLettersInVkupno]
          numberOfLettersInVkupno--;
        }
        console.log(vkupnoString)
        if (vkupnoString.toLowerCase().includes('vkupno')) {
          for (let indexForTotal: number = i; indexForTotal < i + 10; indexForTotal++) {
            console.log('inside if')
            if ("d,".includes(text[indexForTotal] && text[indexForTotal].toLowerCase())) {
              totalExtracted = true;
              break
            }
            invoiceTotal += text[indexForTotal];
          }
        }

      }


        if (totalExtracted && text[i - 9].toLowerCase() === 'm' && text[i - 8].toLowerCase() === "i" && text[i - 7].toLowerCase() === "t" && text[i - 6].toLowerCase() === "r"
          && text[i - 5].toLowerCase() === "e" && text[i - 4].toLowerCase() === "v" && text[i - 3].toLowerCase() === "s" && text[i - 2].toLowerCase() === "k" && text[i - 1].toLowerCase() === "i") {
          for (let indexForDate: number = i; indexForDate < i + 12; indexForDate++) {
            if ('abcdefghijklmnopqrstuvwqyz'.includes(text[indexForDate] && text[indexForDate].toLowerCase())) {
              date = date.trim()
              break
            }
            date += text[indexForDate];
          }
        }
      if(date) break;
    }

    this.uploadedInvoices.push({
      invoiceNumber: invoiceNumber,
      invoiceDocumentType: invoiceDocumentType,
      owner: owner,
      emb: emb,
      address: address,
      contact: "",
      date: date,
      registrationNumber: registrationNumber,
      brand: brand,
      type: type,
      manufacturingYear: manufacturingYear,
      engineNumber: engineNumber,
      chassisNumber: chassisNumber,
      kw: kw,
      km: km,
      autoPartsOutOfStock: partNamesInDocuments,
      labour: labour,
      totalPrice: invoiceTotal
    })

    if(this.uploadedInvoices.owner && this.uploadedInvoices.registrationNumber) this

    console.log(this.uploadedInvoices)

  }

  onFilesUpload(event: any) {
    this.ownerEmptyError = false;
    this.serverErrorMessage = "";

    let files: any = event.target && event.target.files;
    for (let i: any = 0; i < files.length; i++) {
      const reader = new FileReader();
      this.onReadFile(reader)
      reader.readAsBinaryString(files[i]);
    }
    setTimeout(() => this.validateInvoiceOwnerFields(), 200)

  }

  onWordFilesUpload(event: any) {
    let files: any = event.target && event.target.files;
    for (let i: any = 0; i < files.length; i++) {
      this.readDocxFile(files[i])
    }
  }

  validateInvoiceOwnerFields() {
    for (let i: number = 0; i < this.uploadedInvoices.length; i++) {
      if (!this.uploadedInvoices[i].owner) {
        this.ownerEmptyError = true;
        this.uploadedInvoices = [];
        break;
      }
    }
  }

  onReadFile(reader: any) {
    let workBook: any = null;
    let jsonData: any = null;

    reader.onload = (event: any) => {
      const data = event.target && event.target.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      let jsonKeys: any = Object.keys(jsonData)
      let sheet: any = jsonData[jsonKeys[0]];

      let keysOfFirstObject: any = Object.keys(sheet[0])
      let valuesOfRegistrationObject: any = Object.values(sheet[0])
      let valuesOfBrandObject: any = Object.values(sheet[1])
      let valuesOfTypeObject: any = Object.values(sheet[2])
      let valuesOfManufacturingYearObject: any = Object.values(sheet[3])
      let valuesOfEngineNumberObject: any = Object.values(sheet[4])
      let valuesOfChassisNumberObject: any = Object.values(sheet[5])
      let valuesOfKwObject: any = Object.values(sheet[6])
      let valuesOfOwnerObject: any = Object.values(sheet[7])
      let valuesOfAddressObject: any = Object.values(sheet[8])
      let valuesOfEmbObject: any = Object.values(sheet[9])
      let valuesOfKmObject: any = Object.values(sheet[10])
      let valuesOfContactObject: any = Object.values(sheet[11])

      let invoiceDocumentType: any = this.removeNumbersSymbolsAndSpaces(keysOfFirstObject[0])

      let invoiceNumber: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(keysOfFirstObject[0]);
      let registrationNumber: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfRegistrationObject[0]);
      let brand: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfBrandObject[0], true);
      if (brand) brand = brand.trim()
      let type: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfTypeObject[0], true);
      if (type) type = type.trim();
      let manufacturingYear: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfManufacturingYearObject[0]);
      let engineNumber: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfEngineNumberObject[0]);
      let chassisNumber: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfChassisNumberObject[0]);
      let kw: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfKwObject[0])?.substring(2);
      let owner: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfOwnerObject[0], true);
      let address: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfAddressObject[0], true);
      let emb: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfEmbObject[0]);
      let km: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfKmObject[0])?.substring(2);

      let indexForRow:number = 13;

      let isContactExist = this.removeNumbersSymbolsAndSpaces(valuesOfContactObject[0]);
      let contact: any = ""
      if(isContactExist?.toLowerCase().includes('контакт')) {
        contact = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfContactObject[0], true);
        if (contact) contact = contact.trim();
      } else {
        if(isContactExist?.toLowerCase().includes('опис')) {
          indexForRow = 12
        }
      }


      if(invoiceDocumentType.toLowerCase().includes('лог') || invoiceDocumentType.toLowerCase().includes('log')) invoiceDocumentType = 'warrant'
      if(invoiceDocumentType.toLowerCase().includes('фак') || invoiceDocumentType.toLowerCase().includes('fak') ) invoiceDocumentType = 'invoice'
      if(invoiceDocumentType.toLowerCase().includes('пон') || invoiceDocumentType.toLowerCase().includes('pon')) invoiceDocumentType = 'offer'

      let autoPartsList: any = []
      let invoiceTotalPrice: any = 0;
      let labour: any;

      for (indexForRow; indexForRow < sheet.length; indexForRow++) {
        let substringValue: any = 2;
        if (indexForRow > 21) substringValue = 3

        let valuesOfAutoPartObject: any = Object.values(sheet[indexForRow]);
        let valuesOfNextAutoPartObject: any = Object.values(sheet[indexForRow + 1]);

        let autoPartName: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfAutoPartObject[0], true)?.substring(substringValue)
        if (autoPartName) autoPartName = autoPartName.trim();

        let autoPartQuantity: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfAutoPartObject[1])
        let autoPartPurchasePrice: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfAutoPartObject[2])
        let autoPartTotalPrice: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfAutoPartObject[3])

        if (valuesOfNextAutoPartObject[1] && valuesOfNextAutoPartObject[2]) {
          if(autoPartName.toLowerCase().includes('rabotna') && autoPartName.toLowerCase().includes('raka')) {
            labour = autoPartTotalPrice;
            invoiceTotalPrice += parseInt(autoPartTotalPrice)
          }
          else {
            autoPartsList.push({
              name: autoPartName,
              quantity: autoPartQuantity,
              purchasePrice: autoPartPurchasePrice,
              totalPrice: autoPartTotalPrice,
            })
            invoiceTotalPrice += parseInt(autoPartTotalPrice)
          }
        } else {
          if(autoPartName.toLowerCase().includes('rabotna') && autoPartName.toLowerCase().includes('raka')) {
            labour = autoPartTotalPrice;
            invoiceTotalPrice += parseInt(autoPartTotalPrice)
          }
          break;
        }

      }

      let valuesOfDateObject: any = Object.values(sheet[sheet.length - 3]);
      let date: any = this.removeCyrillicLettersDoubleQuotesAndSpaces(valuesOfDateObject[0])

      this.uploadedInvoices.push({
        invoiceNumber: invoiceNumber,
        invoiceDocumentType: invoiceDocumentType,
        owner: owner,
        emb: emb,
        address: address,
        contact: contact,
        date: date,
        registrationNumber: registrationNumber,
        brand: brand,
        type: type,
        manufacturingYear: manufacturingYear,
        engineNumber: engineNumber,
        chassisNumber: chassisNumber,
        kw: kw,
        km: km,
        autoPartsOutOfStock: autoPartsList,
        labour: labour,
        totalPrice: invoiceTotalPrice
      })

    }
  }



  removeCyrillicLettersDoubleQuotesAndSpaces(value: string, leaveSpacesInString?: boolean) {
    if (!value) return
    for (let i: number = value.length; i > -1; i--) {
      if (this.isLetterCyrillic(value[i]) || value[i] === ":" || (value[i] === " " && !leaveSpacesInString)) {
        value = this.removeCharAt(value, i)
      }
    }
    return value;
  }

  removeNumbersSymbolsAndSpaces(value: string) {
    if (!value) return
    for (let i: number = value.length; i > -1; i--) {
      if ("0123456789 :/".includes(value[i])) {
        value = this.removeCharAt(value, i)
      }
    }
    return value;
  }

  removeCharAt(value: string, index: number) {
    var tmp = value.split(''); // convert to an array
    tmp.splice(index, 1); // remove 1 element from the array
    return tmp.join(''); // reconstruct the string
  }

  isLetterCyrillic(character: string) {
    if (!character) return;
    return 'абвгдѓежзѕијклљмнњопрстќуфхцчџш'.includes(character.toLowerCase());
  }

  import(): void {
    let invoicesRequest: any = {
      invoiceList: this.uploadedInvoices
    }
    this.isPageSpinnerOn = true;
    this.invoiceService.postInvoiceList(invoicesRequest).subscribe({
      next: (response: any[]) => {
        this.successMessage = "Документот е успешно прикачена"
        this.uploadedInvoices = [];
        setTimeout(() => this.successMessage = "", 4000)
        this.isPageSpinnerOn = false
      },
      error: error => {
        this.serverErrorMessage = error && error.error;
        this.uploadedInvoices = [];
        this.isPageSpinnerOn = false
        return false;
      }
    })
  }

  importWord(): void {
    let invoicesRequest: any = {
      invoiceList: this.uploadedInvoices
    }
    this.isPageSpinnerOn = true;
    this.invoiceService.postInvoiceList(invoicesRequest).subscribe({
      next: (response: any[]) => {
        this.successMessage = "Документот е успешно прикачена"
        this.uploadedInvoices = [];
        setTimeout(() => this.successMessage = "", 4000)
        this.isPageSpinnerOn = false
      },
      error: error => {
        this.serverErrorMessage = error && error.error;
        this.uploadedInvoices = [];
        this.isPageSpinnerOn = false
        return false;
      }
    })
  }


}
