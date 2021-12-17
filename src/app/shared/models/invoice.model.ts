import {IAutoPart} from "./auto-part.model";

export interface IInvoice {
  _id?: string;
  person: string,
  company: string,
  emb: string,
  address: string,
  contactPerson: string,
  contactNumber: string,
  date: string,

  registrationNumber: string,
  brand: string,
  type: string,
  manufacturingYear: string,
  engineNumber: string,
  chassisNumber: string,
  kw: string,
  km: string,

  autoPartsFromStock: IAutoPart[],
  autoPartsOutOfStock: IAutoPart[],

  labour: string,

}
