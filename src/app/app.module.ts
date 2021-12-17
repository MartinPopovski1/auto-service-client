import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/* dependencies */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* pages */
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { StockPageComponent } from "./pages/stock-page/stock-page.component";
import { InvoicePageComponent } from "./pages/invoice-page/invoice-page.component";
import { HistoryOfAutoPartsPageComponent } from "./pages/history-of-autoparts-page/history-of-auto-parts-page.component";
import { CreateEditViewInvoicePageComponent } from "./pages/create-edit-view-invoice-page/create-edit-view-invoice-page.component";
import { UploadInvoicePageComponent } from "./pages/upload-invoice-page/upload-invoice-page.component";

/* shared */
import {CommonModalComponent} from "./shared/components/common-modal/common-modal.component";
import {StockService} from "./shared/services/stock/stock.service";
import {InvoiceService} from "./shared/services/invoice/invoice.service";
import {HttpClientModule} from "@angular/common/http";
import { FilterPipe} from "./shared/pipes/filter-pipe";
import {SaveFilesService} from "./shared/services/readWordFiles/save-files.service";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    StockPageComponent,
    InvoicePageComponent,
    CommonModalComponent,
    HistoryOfAutoPartsPageComponent,
    CreateEditViewInvoicePageComponent,
    UploadInvoicePageComponent,

    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [StockService, InvoiceService, SaveFilesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
