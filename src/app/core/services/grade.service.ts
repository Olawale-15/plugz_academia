import {
  NewGrading,
  UpdateGrade,
  GetGradeParams,
  GradeResponse,
  DeleteGradeParams
} from '../models/grade.model';

import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private apiUrlService: BaseApiUrlService,
  ) {
    this.baseUrl = this.apiUrlService.Url + 'Administration/';
  }

  /*Grade Methods*/

  // Create New Grade
  newGrade(data: NewGrading): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewGrading`, data);
  }

  updateGrade(data: UpdateGrade): Observable<ApiResponse<any>> {
    console.log('POST URL:', `${this.baseUrl}UpdateGrading`);
    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}UpdateGrading`,
      data,
    );
  }

  // Get Grades
  getGrade(params: GetGradeParams): Observable<ApiResponse<any>> {
    let httpPrams = new HttpParams().set('MerchantId', params.MerchantId);
    if (params.RecId) httpPrams = httpPrams.set('RecId', params.RecId);
    return this.http.get<ApiResponse<GradeResponse[]>>(
      `${this.baseUrl}GetGrading`,
      { params: httpPrams },
    );
  }

  //Delete Grade
  deleteGrade(params: DeleteGradeParams):Observable<ApiResponse<any>>{
     return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteGrading`, {body: params})
  }
}
