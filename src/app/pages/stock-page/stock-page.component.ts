import {Component, ViewChild, OnInit, Injectable} from '@angular/core';
import {CommonModalComponent} from "../../shared/components/common-modal/common-modal.component";
import {ModalConfig} from "../../shared/components/common-modal/modal.config";
import {StockService} from "../../shared/services/stock/stock.service";
import {Observable, Subscription} from "rxjs";
import {IAutoPart} from "../../shared/models/auto-part.model";

@Component({
  selector: 'stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
@Injectable()
export class StockPageComponent implements OnInit {
  title = 'stock-page';

  @ViewChild('modal') private modalComponent: CommonModalComponent | undefined
  @ViewChild('modalForEdit') private modalForEditComponent: CommonModalComponent | undefined
  @ViewChild('modalForDelete') private modalForDeleteComponent: CommonModalComponent | undefined

  customModalConfig: ModalConfig
  customModalConfigForDelete: ModalConfig
  customModalConfigForEdit: ModalConfig

  searchText: string = ""
  autoParts: any[] = []

  newAutoPartName: string = ""
  newAutoPartBrand: string = ""
  newAutoPartQuantity: string = ""
  newAutoPartPurchasePrice: string = ""

  editAutoPartId: string = ""
  editAutoPartName: string = ""
  editAutoPartBrand: string = ""
  editAutoPartQuantity: string = ""
  editAutoPartPurchasePrice: string = ""

  deleteAutoPartId:string = ""

  showErrorDialogMessage: boolean = false
  isQuantityInEditMode: boolean = false

  isPageSpinnerOn: boolean = false


  constructor(private stockService: StockService) {
    this.customModalConfig = {
      modalTitle: "Нов дел",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Зачувај",
      shouldClose: this.onCloseNewAutoPartModalHandler.bind(this)
    }

    this.customModalConfigForEdit = {
      modalTitle: "Измени дел",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Зачувај",
      shouldClose: this.onCloseEditAutoPartModalHandler.bind(this)
    }

    this.customModalConfigForDelete = {
      modalTitle: "Внимание",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Избриши",
      shouldClose: this.onCloseDeleteAutoPartModalHandler.bind(this)
    }

  }


  onCloseNewAutoPartModalHandler() {
    if (!this.newAutoPartName || !this.newAutoPartBrand || !this.newAutoPartQuantity || !this.newAutoPartPurchasePrice) {
      this.showErrorDialogMessage = true;
      console.log('here')
      return false;
    }
    let newAutoPart = {
      name: this.newAutoPartName,
      brand: this.newAutoPartBrand,
      quantity: this.newAutoPartQuantity,
      purchasePrice: this.newAutoPartPurchasePrice,
    }
    this.isPageSpinnerOn = true;
    return this.stockService.postAutoPart(newAutoPart).subscribe({
      next: () => {
        this.isPageSpinnerOn = false;
        this.clearNewPartInputs()
        this.ngOnInit()
        return true;
      },
      error: error => {
        this.isPageSpinnerOn = false;
        console.log(error);
        return false;
      }
    });
  }
  onCloseEditAutoPartModalHandler() {
    if (!this.editAutoPartName || !this.editAutoPartBrand || !this.editAutoPartQuantity || !this.editAutoPartPurchasePrice) {
      this.showErrorDialogMessage = true;
      return false;
    }
    let editAutoPart = {
      _id: this.editAutoPartId,
      name: this.editAutoPartName,
      brand: this.editAutoPartBrand,
      quantity: this.editAutoPartQuantity,
      purchasePrice: this.editAutoPartPurchasePrice,
    }
    this.isPageSpinnerOn = true;
    return this.stockService.putAutoPart(editAutoPart).subscribe({
      next: () => {
        this.isPageSpinnerOn = false
        this.clearEditPartInputs()
        this.ngOnInit()
        return true;
      },
      error: error => {
        console.log(error);
        this.isPageSpinnerOn = false;
        return false;
      }
    });
  }

  onCloseDeleteAutoPartModalHandler() {
    this.isPageSpinnerOn = true;
    return this.stockService.deleteAutoPart(this.deleteAutoPartId).subscribe({
      next: () => {
        this.deleteAutoPartId = ""
        this.isPageSpinnerOn = false
        this.ngOnInit()
        return true;
      },
      error: () => {
        this.deleteAutoPartId = ""
        this.isPageSpinnerOn = false;
        return false;
      }
    });
  }

  onSaveQuantityInputHandler(autoPart: any) {
    this.isPageSpinnerOn = true;
    return this.stockService.putAutoPart(autoPart).subscribe({
      next: () => {
        autoPart.isQuantityInEditMode = false;
        this.isPageSpinnerOn = false
        return true;
      },
      error: error => {
        console.log(error);
        this.isPageSpinnerOn = false;
        return false;
      }
    });
  }

  onCloseQuantityInput(autoPart:any) {
    autoPart.isQuantityInEditMode = false;
    this.ngOnInit()
  }

  ngOnInit() {
    this.isPageSpinnerOn = true
    this.stockService.getAutoParts().subscribe({
      next: (autoParts: any[]) => {
        this.autoParts = autoParts;
        this.isPageSpinnerOn = false
      },
      error: error => {
        console.log(error);
        this.isPageSpinnerOn = false
        return false;
      }
    });
  }

  clearNewPartInputs() {
    this.newAutoPartName = "";
    this.newAutoPartBrand = "";
    this.newAutoPartQuantity = "";
    this.newAutoPartPurchasePrice = "";
  }
  clearEditPartInputs() {
    this.editAutoPartName = "";
    this.editAutoPartBrand = "";
    this.editAutoPartQuantity = "";
    this.editAutoPartPurchasePrice = "";
  }

  async openModal() {
    return this.modalComponent && await this.modalComponent.open()
  }
  async openModalForEdit(autoPart:any) {
    this.editAutoPartId = autoPart._id;
    this.editAutoPartName = autoPart.name;
    this.editAutoPartBrand = autoPart.brand;
    this.editAutoPartQuantity = autoPart.quantity;
    this.editAutoPartPurchasePrice = autoPart.purchasePrice;
    return this.modalForEditComponent && await this.modalForEditComponent.open()
  }
  async openModalForDelete(autoPart:any) {
    this.deleteAutoPartId = autoPart._id;
    return this.modalForDeleteComponent && await this.modalForDeleteComponent.open()
  }


}
