import {Component, OnInit, Injectable, ViewChild} from '@angular/core';
import {InvoiceService} from "../../shared/services/invoice/invoice.service";
import {Observable, Subscription, OperatorFunction} from "rxjs";
import {IInvoice} from "../../shared/models/invoice.model";
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {CommonModalComponent} from "../../shared/components/common-modal/common-modal.component";
import {ModalConfig} from "../../shared/components/common-modal/modal.config";

@Component({
  selector: 'invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.css']
})
@Injectable()
export class InvoicePageComponent implements OnInit {
  title = 'invoice-page';

  @ViewChild('modalForRemoveInvoices') private modalComponentForRemoveInvoices: CommonModalComponent | undefined
  customModalConfigForRemoveInvoice: ModalConfig

  stagedInvoiceForRemove: any = {}
  selectedCar: any = {}
  carsInfo: any[] = []
  searchText: string = "";
  allResults: any[] = [];
  isPageSpinnerOn: boolean = false;

  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute, private router:Router ) {
    this.customModalConfigForRemoveInvoice = {
      modalTitle: "Внимание",
      dismissButtonLabel: "Откажи",
      closeButtonLabel: "Избриши",
      shouldClose: this.onCloseRemoveInvoiceDialog.bind(this)
    }
  }


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allResults.filter(v => v.searchLabel && v.searchLabel.toLowerCase().includes(term.toLowerCase())))
    )


  ngOnInit() {
    this.isPageSpinnerOn = true;
    this.invoiceService.getCarsInfo().subscribe({
      next: (carsInfo: any[]) => {
        this.carsInfo = carsInfo;
        this.allResults = this.carsInfo ? this.carsInfo.map(carInfo => {
          return {
            ...carInfo,
            invoices: carInfo.invoiceDates && carInfo.invoiceDates.filter((invoiceDateObj:any) => invoiceDateObj.invoiceDocumentType === "invoice"),
            warrants: carInfo.invoiceDates && carInfo.invoiceDates.filter((invoiceDateObj:any) => invoiceDateObj.invoiceDocumentType === "warrant"),
            offers: carInfo.invoiceDates && carInfo.invoiceDates.filter((invoiceDateObj:any) => invoiceDateObj.invoiceDocumentType === "offer"),
            searchLabel: `${carInfo.owner} | ${carInfo.registrationNumber}` || ""
          }
        }) : [];
        console.log(this.allResults)
        let registrationNum = this.route.snapshot.params['regNum']
        if(registrationNum) {
          this.selectedCar = this.allResults.find(result => result.registrationNumber === registrationNum)
        }

        this.isPageSpinnerOn = false;
      },
      error: error => {
        console.log(error);
        this.isPageSpinnerOn = false;
        return false;
      }
    });
  }

  onCloseRemoveInvoiceDialog() {
    this.isPageSpinnerOn = true;
    return this.invoiceService.removeInvoice(this.stagedInvoiceForRemove.id).subscribe({
      next: () => {
        if(this.selectedCar.invoiceDates && this.selectedCar.invoiceDates.length === 1)  {
          if(this.route.snapshot.params['regNum']) this.router.navigate([`/search-invoice`])
          else location.reload()
        }
        else if(this.route.snapshot.params['regNum']) location.reload()
        else this.router.navigate([`/search-invoice/${this.selectedCar.registrationNumber}`])
        this.isPageSpinnerOn = false;
        return true;
      },
      error: (response) => {
        console.log(response);
        this.isPageSpinnerOn = false;
        return false;
      }
    })
  }

  onRemoveInvoice(invoiceDateObj: any) {
    this.stagedInvoiceForRemove = invoiceDateObj;
    return this.modalComponentForRemoveInvoices && this.modalComponentForRemoveInvoices.open()
  }

  onChosenOptionHandler(event: any) {
    if (event && event.item && event.item.registrationNumber) {
      this.selectedCar = event.item;
      setTimeout(() => this.clearSearchInput(), 0)
    }
  }

  clearSearchInput() {
    this.searchText = "";
    let input = document.getElementById('typeahead-basic')
    if (input) input.blur()
  }

  formatter = (x: { searchLabel: string }) => x.searchLabel;


}
