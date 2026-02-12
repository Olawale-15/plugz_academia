// Transfer  Interface
import {
  NewTransfer,
  UpdateTransfer,
  ApproveTransfer,
  DeleteTransfer,
  GetTransferPrams,
  GetTransferResponse,
} from '../models/transfer.model';

import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';
import { GradeResponse } from '../models/grade.model';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private baseUrl: string;
  constructor(private http: HttpClient, private appUrlService: BaseApiUrlService) {
    this.baseUrl = this.appUrlService.Url + 'Enrollment/'
  }

   /*Trasfer Method*/

  //  Creat New Transfer
  newTransfer(data: NewTransfer): Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewTransfer`, data)
  }

  // Update Transfer
  updateTransfer(data: UpdateTransfer): Observable<ApiResponse<any>>{
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateTransfer`, data)
  }

  getTransfer(params: GetTransferPrams): Observable<ApiResponse<any>>{
    let httpPrams = new HttpParams().set('MerchantId', params.MerchantId);
    if(params.RecId){
      httpPrams =  httpPrams.set('RecId', params.RecId)
    }

    return this.http.get<ApiResponse<GradeResponse[]>>(`${this.baseUrl}GetTransfer`, {params: httpPrams})
  }

  // Approve Transfer
}
