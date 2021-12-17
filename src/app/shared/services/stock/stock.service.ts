import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {IAutoPart} from "../../models/auto-part.model";
import {catchError, Observable} from "rxjs";

@Injectable()
export class StockService {
    autoParts: IAutoPart[] = [];
    apiURL = 'http://localhost:3000/api'
    constructor(private http:HttpClient){}

  getAutoParts():Observable<IAutoPart[]> {
    return this.http.get<IAutoPart[]>(`${this.apiURL}/stock`)
  }
  getAutoPart(autoPartId:string) {
    return this.http.get(`${this.apiURL}/stock/${autoPartId}`)
  }
  deleteAutoPart(autoPartId:string) {
    return this.http.delete(`${this.apiURL}/stock/${autoPartId}`)
  }

  postAutoPart(autoPart: IAutoPart): Observable<IAutoPart> {
    return this.http.post<IAutoPart>(`${this.apiURL}/stock`, autoPart)
      .pipe(
        catchError(this.handleError('postAutoPart', autoPart))
      );
  }
  putAutoPart(autoPart: any): Observable<IAutoPart> {
    return this.http.put<IAutoPart>(`${this.apiURL}/stock/${autoPart._id}`, autoPart)
      .pipe(
        catchError(this.handleError('postAutoPart', autoPart))
      );
  }
  handleError<T> (operation = 'operation', result?: T) {
    return (error:any): Observable<T> => {
      console.error(error);
      alert('Data loading error: ' + error.statusText + operation + " Result: " + result)
      throw error
    }
  }
}
