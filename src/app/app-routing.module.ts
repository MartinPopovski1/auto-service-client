import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import {StockPageComponent} from "./pages/stock-page/stock-page.component";
import {InvoicePageComponent} from "./pages/invoice-page/invoice-page.component";
import {HistoryOfAutoPartsPageComponent} from "./pages/history-of-autoparts-page/history-of-auto-parts-page.component";
import {CreateEditViewInvoicePageComponent} from "./pages/create-edit-view-invoice-page/create-edit-view-invoice-page.component";
import {UploadInvoicePageComponent} from "./pages/upload-invoice-page/upload-invoice-page.component";

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'stock', component: StockPageComponent },
  { path: 'search-invoice', component: InvoicePageComponent },
  { path: 'search-invoice/:regNum', component: InvoicePageComponent },
  { path: 'create-invoice/:invoiceDocumentType', component: CreateEditViewInvoicePageComponent },
  { path: 'upload-invoice', component: UploadInvoicePageComponent },
  { path: 'invoice/:invoiceId', component: CreateEditViewInvoicePageComponent },
  { path: 'invoice/historyOfAutoParts/:regNum', component: HistoryOfAutoPartsPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
