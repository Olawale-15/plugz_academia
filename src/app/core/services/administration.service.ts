import {
  NewClassOrSubClass,
  UpdateClassOrSubClass,
  GetClassParams,
  DeleteClassOrSubClass,
  NewSubject,
  UpdateSubject,
  GetSubjectParams,
  SubjectResponse,
  DeleteSubject
} from '../models/administration.model';
import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';

@Injectable({
  providedIn: 'root',
})
export class AdministrationService {
  private baseUrl: string;

  constructor(private http: HttpClient, private apiUrlService: BaseApiUrlService) {
    this.baseUrl = this.apiUrlService.Url + 'Administration/';
  }

  /* Class/SubClass Methods */

  // Create new class or subclass
  newClassOrSubClass(data: NewClassOrSubClass): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewClassOrSubClass`, data);
  }

  // Update class or subclass
  updateClassOrSubClass(data: UpdateClassOrSubClass): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateClassorSubClass`, data);
  }

  // Get class list or single class
  // getClass(params: GetClassParams): Observable<ApiResponse<any>> {
  //   let httpParams = new HttpParams()
  //     .set('MerchantId', params.MerchantId);

  //   if (params.ClassId) {
  //     httpParams = httpParams.set('ClassId', params.ClassId);
  //   }

  //   return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetClass`, { params: httpParams });
  // }

  getClass(params: any): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();

    // This loop ensures MerchantId AND any search filters are added to the URL
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetClass`, { params: httpParams });
  }

  // Delete class or subclass
  deleteClassOrSubClass(data: DeleteClassOrSubClass): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteClassorSubClass`, { body: data });
  }

  /* Subject Methods */

  // Create new subject
  newSubject(data: NewSubject): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewSubject`, data);
  }

  // Update subject
  updateSubject(data: UpdateSubject): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateSubject`, data);
  }

  // Get subject list or single subject
  getSubject(params: GetSubjectParams): Observable<ApiResponse<SubjectResponse[]>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);

    if (params.SubjectId) {
      httpParams = httpParams.set('SubjectId', params.SubjectId);
    }

    return this.http.get<ApiResponse<SubjectResponse[]>>(`${this.baseUrl}GetSubject`, { params: httpParams });
  }

  // Delete subject
  deleteSubject(data: DeleteSubject): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteSubject`, { body: data });
  }
}
