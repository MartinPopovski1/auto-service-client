import {Component, ViewChild, OnInit, Injectable} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {InvoiceService} from "../../shared/services/invoice/invoice.service";

@Component({
  selector: 'history-of-auto-parts-page',
  templateUrl: './history-of-auto-parts-page.component.html',
  styleUrls: ['./history-of-auto-parts-page.component.css']
})
@Injectable()
export class HistoryOfAutoPartsPageComponent implements OnInit {
  title = 'history-of-auto-parts-page';
  autoParts: any[] = []
  searchText: string = ""

  constructor(private invoiceService:InvoiceService, public route:ActivatedRoute) {


  }

  ngOnInit() {
    this.invoiceService.getHistoryOfAutoParts(this.route.snapshot.params['regNum']).subscribe({
      next: (autoParts:any[]) => {
        this.autoParts = autoParts;
      },
      error: error => {
        console.log(error);
        return false;
      }
    });
  }

  onCloseHandler() {

  }



}
