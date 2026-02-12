import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private apiUrlService: BaseApiUrlService,
  ) {
    this.baseUrl = this.apiUrlService.Url + 'Lookup/';
  }

  /**
   * Get a list of options for StudentStatus dropdown list
   */
  getStudentStatus(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetStudentStatus?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get a list of departments
   */
  getDepartment(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetDepartment?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get a list of gender types
   */
  getGender(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetGender?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get a list of school levels
   */
  getLevel(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetLevel?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get a list of supported currencies
   */
  getCurrency(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetCurrency?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get list of subjects for a merchant
   */
  getSubjects(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetSubjects?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get list of classes/sub classes for a merchant
   */
  getClasses(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetClasses?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get a list of dynamic field types
   */
  getDynamicTypes(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetDynamicTypes`);
  }

  /**
   * Get current academic session
   */
  getAcademicSession(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetAcademicSession?MerchantId=${MerchantId}`,
    );
  }

  /**
   * Get current academic term
   */
  getAcademicTerm(MerchantId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}GetAcademicTerm?MerchantId=${MerchantId}`,
    );
  }


 getProgramme(merchantId: string): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(
    `${this.baseUrl}GetProgramme?MerchantId=${merchantId}`
  );
}

getStudent(MerchantId:string):Observable<ApiResponse<any>>{
  return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetStudent?MerchantId=${MerchantId}`);
}

}
