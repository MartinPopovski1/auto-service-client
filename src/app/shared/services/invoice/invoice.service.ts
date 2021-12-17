import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {IInvoice} from "../../models/invoice.model";
import {catchError, Observable, Subscription} from "rxjs";

@Injectable()
export class InvoiceService {
    invoices: IInvoice[] = [];
    apiURL = 'http://localhost:3000/api'
    constructor(private http:HttpClient){}

  getCarsInfo():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/invoice/carInfo`)
  }
  getInvoicesForCar(registrationNumber:string):Observable<IInvoice[]> {
    return this.http.get<IInvoice[]>(`${this.apiURL}/invoice?registrationNumber=${registrationNumber}`)
  }

  getInvoice(invoiceId:string):Observable<any> {
    return this.http.get<any>(`${this.apiURL}/invoice/${invoiceId}`)
  }

  removeInvoice(invoiceId:string):Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/invoice/${invoiceId}`)
  }

  getHistoryOfAutoParts(registrationNumber:string):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/invoice/historyOfAutoParts?registrationNumber=${registrationNumber}`)
  }

  putInvoice(invoice: any): Observable<IInvoice> {
    return this.http.put<IInvoice>(`${this.apiURL}/invoice/${invoice._id}`, invoice)
      .pipe(
        catchError(this.handleError('putInvoice', invoice))
      );
  }
  postInvoice(invoice: any): Observable<IInvoice> {
    return this.http.post<IInvoice>(`${this.apiURL}/invoice`, invoice)
      .pipe(
        catchError(this.handleError('postInvoice', invoice))
      );
  }
  postInvoiceList(invoices: any) {
      console.log(invoices)
    return this.http.post<any>(`${this.apiURL}/invoice/invoiceList`, invoices)
      .pipe(
        catchError(this.handleError('postInvoiceList', invoices))
      );
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error:any): Observable<T> => {
      console.error(error);
      // alert('Data loading error: ' + error.statusText + operation + " Result: " + result)
      throw error
    }
  }
}
