import {Component, OnInit, Injectable, ViewChild} from '@angular/core';
import {InvoiceService} from "../../shared/services/invoice/invoice.service";
import {Observable, Subscription, OperatorFunction} from "rxjs";
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {IInvoice} from "../../shared/models/invoice.model";
import {StockService} from "../../shared/services/stock/stock.service";
import {CommonModalComponent} from "../../shared/components/common-modal/common-modal.component";
import {ModalConfig} from "../../shared/components/common-modal/modal.config";

@Component({
  selector: 'invoice-page',
  templateUrl: './create-edit-view-invoice-page.component.html',
  styleUrls: ['./create-edit-view-invoice-page.component.css']
})
@Injectable()
export class CreateEditViewInvoicePageComponent implements OnInit {
  title = 'create-edit-view-invoice-page';

  @ViewChild('modalForRemoveFreeParts') private modalComponentForRemoveFreeParts: CommonModalComponent | undefined
  @ViewChild('modalForRemoveStockParts') private modalComponentForRemoveStockParts: CommonModalComponent | undefined
  customModalConfigForRemoveStockParts: ModalConfig
  customModalConfigForRemoveFreeParts: ModalConfig


  autoParts: any[] = [];
  allResults: any[] = [];
  selectedStockAutoParts: any[] = [];
  freeParts: any[] = [];
  allPartsInInvoice: any[] = [];

  isPageSpinnerOn: boolean = false
  createMode: boolean = false
  editMode: boolean = false
  showAlertForAlreadyEnteredPart: boolean = false
  withoutDDV: boolean = false

  searchStockPart: any = {}
  newStockPartBrand: string = ""
  newStockPartQuantity: string = ""
  newStockPartPurchasePrice: string = ""
  newStockPartTotalPrice: string = ""

  freePart: string = ""
  newFreePartBrand: string = ""
  newFreePartQuantity: string = ""
  newFreePartPurchasePrice: string = ""
  newFreePartTotalPrice: string = ""


  invoiceId: string = ""
  invoiceDocumentType: string = ""
  invoiceDate: string = ""
  invoiceNumber: string = ""
  invoiceRegistrationNumber: string = ""
  invoiceBrand: string = ""
  invoiceType: string = ""
  invoiceManufacturingYear: string = ""
  invoiceEngineNumber: string = ""
  invoiceChassisNumber: string = ""
  invoiceKw: string = ""
  invoiceKm: string = ""
  invoiceOwner: string = ""
  invoiceAddress: string = ""
  invoiceEmb: string = ""
  invoiceContact: string = ""
  invoiceLabour: string = ""
  invoiceTotalPrice: string = ""
  invoiceTotalPriceDDV: string = ""
  invoiceTotalPriceWithoutDDV: string = ""

  invoiceErrorMessage: string = ""
  invoiceSuccessMessage: string = ""

  stagedItemForRemove: any = {}

  constructor(private stockService: StockService, private invoiceService: InvoiceService, public route: ActivatedRoute, private router: Router) {
    this.customModalConfigForRemoveStockParts = {
      modalTitle: "Внимание",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Избриши",
      shouldClose: this.onCloseRemoveStockPartDialog.bind(this)
    }
    this.customModalConfigForRemoveFreeParts = {
      modalTitle: "Внимание",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Избриши",
      shouldClose: this.onCloseRemoveFreePartDialog.bind(this)
    }
  }


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allResults.filter(v => v.searchLabel && v.searchLabel.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  ngOnInit() {
    this.isPageSpinnerOn = true;
    this.stockService.getAutoParts().subscribe({
      next: (autoParts: any[]) => {
        this.autoParts = autoParts;
        this.allResults = this.autoParts ? this.autoParts.map(autoPart => {
          return {
            ...autoPart,
            searchLabel: `${autoPart.name} | ${autoPart.brand}` || ""
          }
        }) : [];
        this.isPageSpinnerOn = false;
      },
      error: error => {
        console.log(error);
        this.isPageSpinnerOn = false;
        return false;
      }
    });
    let invoiceId = this.route.snapshot.params['invoiceId']
    if (!invoiceId) {
      this.invoiceDocumentType = this.route.snapshot.params['invoiceDocumentType']
      this.createMode = true;
      this.editMode = true;
    } else {
      this.isPageSpinnerOn = true;
      this.invoiceService.getInvoice(invoiceId).subscribe({
        next: (invoice: any) => {
          console.log(invoice)
          this.invoiceId = invoice._id
          this.invoiceDocumentType = invoice.invoiceDocumentType
          this.invoiceDate = invoice.date
          this.invoiceNumber = invoice.invoiceNumber
          this.invoiceRegistrationNumber = invoice.registrationNumber
          this.invoiceBrand = invoice.brand
          this.invoiceType = invoice.type
          this.invoiceManufacturingYear = invoice.manufacturingYear
          this.invoiceEngineNumber = invoice.engineNumber
          this.invoiceChassisNumber = invoice.chassisNumber
          this.invoiceKw = invoice.kw
          this.invoiceKm = invoice.km
          this.invoiceOwner = invoice.owner
          this.invoiceAddress = invoice.address
          this.invoiceEmb = invoice.emb
          this.invoiceContact = invoice.contact
          this.invoiceLabour = invoice.labour
          this.invoiceTotalPrice = invoice.totalPrice

          this.selectedStockAutoParts = invoice.autoPartsFromStock;
          this.freeParts = invoice.autoPartsOutOfStock;

          this.invoiceTotalPriceDDV = ((parseFloat(this.invoiceTotalPrice) * 0.18)).toFixed(2).toString()
          this.invoiceTotalPriceWithoutDDV = ((parseFloat(this.invoiceTotalPrice) - parseFloat(this.invoiceTotalPriceDDV))).toFixed(2).toString()
          this.isPageSpinnerOn = false;
        },
        error: (error: any) => {
          console.log(error);
          this.isPageSpinnerOn = false;
          return false;
        }
      });
    }

  }


  onChosenOptionHandler(event: any) {
    if (event && event.item && event.item.name) {
      let isTheItemAlreadyEntered = this.selectedStockAutoParts.findIndex(part => part.searchLabel === event.item.searchLabel);
      if (isTheItemAlreadyEntered > -1) {
        // alert function item already entered
        this.makeAlertForAlreadyEnteredPart()
        this.searchStockPart = {};
        return;
      }
      this.newStockPartBrand = event.item.brand;
      this.newStockPartPurchasePrice = event.item.purchasePrice;
      this.newStockPartQuantity = "1";
      this.newStockPartTotalPrice = (parseInt(this.newStockPartPurchasePrice) * parseInt(this.newStockPartQuantity)).toString();
    }
  }

  onKeyDownQuantityAndPriceHandler(value: any) {
    if (!value || !this.newStockPartPurchasePrice || !this.newStockPartQuantity) return;
    this.newStockPartTotalPrice = (parseInt(this.newStockPartPurchasePrice) * parseInt(this.newStockPartQuantity)).toString();
  }

  onChangePartHandler(event: any) {
    if (!event || !event.name) {
      this.clearNewStockPartInputs();
    }
  }

  makeAlertForAlreadyEnteredPart() {
    this.showAlertForAlreadyEnteredPart = true;
    setTimeout(() => this.showAlertForAlreadyEnteredPart = false, 6000)
  }

  addNewRowInSelectedPartsTable() {
    if (!this.checkIfNewStockPartInputsAreFilled()) return;
    this.selectedStockAutoParts.push({
      searchLabel: this.searchStockPart.searchLabel,
      name: this.searchStockPart.name,
      brand: this.newStockPartBrand,
      quantity: this.newStockPartQuantity,
      purchasePrice: this.newStockPartPurchasePrice,
      totalPrice: this.newStockPartTotalPrice,
    });
    this.clearNewStockPartInputs()
    this.updateTotalPrice()
  }

  onRemoveItemFromStockParts(item: any) {
    this.stagedItemForRemove = item;
    this.openModalForRemoveStockParts()
  }

  onCloseRemoveFreePartDialog() {

    if (this.stagedItemForRemove && this.stagedItemForRemove.id || this.stagedItemForRemove._id) {
      this.freeParts = this.freeParts.filter((part) => part.id !== this.stagedItemForRemove.id || part._id !== this.stagedItemForRemove._id)
      this.stagedItemForRemove = {}
      this.updateTotalPrice()
      return true
    } else return false
  }

  onCloseRemoveStockPartDialog() {

    if (this.stagedItemForRemove && this.stagedItemForRemove.searchLabel || this.stagedItemForRemove._id) {
      this.selectedStockAutoParts = this.selectedStockAutoParts.filter((part) => part.searchLabel !== this.stagedItemForRemove.searchLabel || part._id !== this.stagedItemForRemove._id)
      this.stagedItemForRemove = {}
      this.updateTotalPrice()
      return true
    } else return false
  }

  onRemoveItemFromFreeParts(item: any) {
    this.stagedItemForRemove = item;
    this.openModalForRemoveFreeParts();
  }

  clearNewStockPartInputs() {
    this.searchStockPart = {};
    this.newStockPartBrand = "";
    this.newStockPartQuantity = "";
    this.newStockPartPurchasePrice = "";
    this.newStockPartTotalPrice = "";
  }

  checkIfNewStockPartInputsAreFilled() {
    return this.searchStockPart && this.searchStockPart.name && this.newStockPartBrand
      && this.newStockPartQuantity && this.newStockPartPurchasePrice && this.newStockPartTotalPrice
  }

  addNewRowInFreePartsTable() {
    if (!this.checkIfNewFreePartInputsAreFilled()) return;
    this.freeParts.push({
      id: Date.now(),
      name: this.freePart,
      quantity: this.newFreePartQuantity,
      purchasePrice: this.newFreePartPurchasePrice,
      totalPrice: this.newFreePartTotalPrice,
    });
    this.clearFreePartInputs()
    this.updateTotalPrice()
  }

  onKeyDownQuantityAndPriceFreePartHandler(event: any) {
    if (!event || !this.newFreePartPurchasePrice || !this.newFreePartQuantity) return;
    this.newFreePartTotalPrice = (parseInt(this.newFreePartPurchasePrice) * parseInt(this.newFreePartQuantity)).toString();

  }

  onPrintInvoice(withoutDDV: boolean) {
    this.withoutDDV = withoutDDV
    this.allPartsInInvoice = this.selectedStockAutoParts.concat(this.freeParts)
    setTimeout(() => window.print(), 400)
  }

  onSaveInvoice() {
    if (this.createMode) {
      this.createInvoice()
    } else this.editInvoice()
  }


  createInvoice() {
    this.invoiceErrorMessage = ""
    if (!this.checkRequiredInputs()) {
      this.invoiceErrorMessage = "Мора да се пополнети регистрација, датум и сопственик"
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      return;
    }
    let invoice: any = {
      date: this.invoiceDate,
      invoiceDocumentType: this.invoiceDocumentType,
      invoiceNumber: this.invoiceNumber,
      owner: this.invoiceOwner,
      emb: this.invoiceEmb,
      address: this.invoiceAddress,
      contact: this.invoiceContact,
      registrationNumber: this.invoiceRegistrationNumber,
      brand: this.invoiceBrand,
      type: this.invoiceType,
      manufacturingYear: this.invoiceManufacturingYear,
      engineNumber: this.invoiceEngineNumber,
      chassisNumber: this.invoiceChassisNumber,
      kw: this.invoiceKw,
      km: this.invoiceKm,
      autoPartsFromStock: this.selectedStockAutoParts,
      autoPartsOutOfStock: this.freeParts,
      labour: this.invoiceLabour,
      totalPrice: this.invoiceTotalPrice
    }
    this.isPageSpinnerOn = true;
    this.invoiceService.postInvoice(invoice).subscribe({
      next: (invoice) => {
        this.isPageSpinnerOn = false;
        this.editMode = false;
        this.createMode = false;
        this.router.navigate(['/invoice/' + invoice._id])
      },
      error: (response) => {
        this.isPageSpinnerOn = false;
        alert(response)
      }
    })
  }


  editInvoice() {
    this.invoiceErrorMessage = ""
    if (!this.checkRequiredInputs()) {
      this.invoiceErrorMessage = "Мора да се пополнети регистрација, датум и сопственик"
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      return;
    }
    let invoice: any = {
      _id: this.invoiceId,
      invoiceDocumentType: this.invoiceDocumentType,
      date: this.invoiceDate,
      invoiceNumber: this.invoiceNumber,
      owner: this.invoiceOwner,
      emb: this.invoiceEmb,
      address: this.invoiceAddress,
      contact: this.invoiceContact,
      registrationNumber: this.invoiceRegistrationNumber,
      brand: this.invoiceBrand,
      type: this.invoiceType,
      manufacturingYear: this.invoiceManufacturingYear,
      engineNumber: this.invoiceEngineNumber,
      chassisNumber: this.invoiceChassisNumber,
      kw: this.invoiceKw,
      km: this.invoiceKm,
      autoPartsFromStock: this.selectedStockAutoParts,
      autoPartsOutOfStock: this.freeParts,
      labour: this.invoiceLabour,
      totalPrice: this.invoiceTotalPrice
    }
    this.isPageSpinnerOn = true;
    this.invoiceService.putInvoice(invoice).subscribe({
      next: (invoice) => {
        this.isPageSpinnerOn = false;
        this.editMode = false;
        this.invoiceSuccessMessage = "Успешна промена";
        setTimeout(() => this.invoiceSuccessMessage = "", 4000)
      },
      error: (response) => {
        this.isPageSpinnerOn = false;
        console.log(response)
      }
    })
  }

  checkRequiredInputs() {
    return this.invoiceDate && this.invoiceOwner && this.invoiceRegistrationNumber;
  }

  clearFreePartInputs() {
    this.freePart = "";
    this.newFreePartBrand = "";
    this.newFreePartQuantity = "";
    this.newFreePartPurchasePrice = "";
    this.newFreePartTotalPrice = "";
  }

  onCreateSameInvoice() {
    this.editMode = true;
    this.createMode = true;
    this.selectedStockAutoParts = [];
    this.freeParts = [];
  }


  invoiceNumberValidator() {
    this.invoiceErrorMessage = ''
    for (let i: number = 0; i < this.invoiceNumber.length; i++) {
      if ('abcdefghjkilmnopqrstuvwxyzабвгдѓежзѕијклљмнњопрстќуфхцчџш'.includes(this.invoiceNumber[i])) {
        this.invoiceErrorMessage = 'Бројот на документот содржи букви'
        break;
      }
    }
  }


  invoiceDateValidator() {
    this.invoiceErrorMessage = ''
    if (!this.invoiceDate) return;
    for (let i: number = 0; i < this.invoiceDate.length; i++) {
      if ('abcdefghjkilmnopqrstuvwxyzабвгдѓежзѕијклљмнњопрстќуфхцчџш'.includes(this.invoiceDate[i])) {
        this.invoiceErrorMessage = 'Датумот содржи букви'
        break;
      }
    }

    if (!this.invoiceErrorMessage && !this.invoiceDate.includes('.20')) this.invoiceErrorMessage = 'Датумот не е во точен формат'
  }


  updateTotalPrice() {
    if (!this.invoiceLabour) this.invoiceLabour = "0";
    let stockPartsTotalPrice: number = 0
    let freePartsTotalPrice: number = 0

    this.selectedStockAutoParts.forEach(part => {
      stockPartsTotalPrice += parseInt(part.totalPrice)
    })
    this.freeParts.forEach(part => {
      freePartsTotalPrice += parseInt(part.totalPrice)
    })

    this.invoiceTotalPrice = ((parseInt(this.invoiceLabour) + stockPartsTotalPrice + freePartsTotalPrice)).toFixed(0).toString();
    this.invoiceTotalPriceDDV = ((parseInt(this.invoiceTotalPrice) * 0.18)).toFixed(2).toString();
    this.invoiceTotalPriceWithoutDDV = (parseInt(this.invoiceTotalPrice) - parseInt(this.invoiceTotalPriceDDV)).toString();
  }

  onLabourChange(value: any) {
    setTimeout(() => this.updateTotalPrice(), 0)

  }

  checkIfNewFreePartInputsAreFilled() {
    return this.freePart && this.newFreePartQuantity && this.newFreePartPurchasePrice && this.newFreePartTotalPrice
  }

  formatter = (x: { name: string }) => x.name;

  async openModalForRemoveStockParts() {
    return this.modalComponentForRemoveStockParts && await this.modalComponentForRemoveStockParts.open()
  }

  async openModalForRemoveFreeParts() {
    return this.modalComponentForRemoveFreeParts && await this.modalComponentForRemoveFreeParts.open()
  }


}
