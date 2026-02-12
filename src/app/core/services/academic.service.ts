import {
  newAssessmentType,
  UpdateAssessmentType,
  GetAssessmentTypeParams,
  DeleteAssessmentType,
  Assessment,
  GetAssessmentSummaryParams,
  GetAssessmentParams,
  DeleteAssessment,
  ApproveAssessment
} from './../models/academics.model';
import { ApiResponse } from './../models/api-response.model';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseApiUrlService } from "./baseapiurl.service";

@Injectable({
  providedIn: 'root',
})
export class AcademicService {
  private baseUrl: string;

  constructor(private http: HttpClient, private apiUrlService: BaseApiUrlService) {
    this.baseUrl = this.apiUrlService.Url + 'Academic/';
  }

  /* Assessment Type Methods */

  // Create new assessment type
  newAssessmentType(data: newAssessmentType): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewAssessmentType`, data);
  }

  // Update assessment type
  updateAssessmentType(data: UpdateAssessmentType): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateAssessmentType`, data);
  }

  // Get assessment type(s)
  getAssessmentType(params: GetAssessmentTypeParams): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);

    if (params.AssessmentId) {
      httpParams = httpParams.set('AssessmentId', params.AssessmentId);
    }

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetAssessmentType`, { params: httpParams });
  }

  // Delete assessment type
  deleteAssessmentType(data: DeleteAssessmentType): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteAssessmentType`, { body: data });
  }

  /* Assessment Methods */

  // Create new assessment
  newAssessment(data: Assessment[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewAssessment`, data);
  }

  // Update assessment
  updateAssessment(data: Assessment[]): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateAssessment`, data);
  }

  // Get assessment summary
  getAssessmentSummary(params: GetAssessmentSummaryParams): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);

    if (params.AcademicSession) httpParams = httpParams.set('AcademicSession', params.AcademicSession);
    if (params.AcademicTerm) httpParams = httpParams.set('AcademicTerm', params.AcademicTerm);
    if (params.ClassId) httpParams = httpParams.set('ClassId', params.ClassId);
    if (params.SubClassId) httpParams = httpParams.set('SubClassId', params.SubClassId);
    if (params.SubjectId) httpParams = httpParams.set('SubjectId', params.SubjectId);
    if (params.AssessmentId) httpParams = httpParams.set('AssessmentId', params.AssessmentId);
    if (params.BatchId) httpParams = httpParams.set('BatchId', params.BatchId);

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetAssessmentSummary`, { params: httpParams });
  }

  // Get assessment
  getAssessment(params: GetAssessmentParams): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);
    if (params.BatchId) {
      httpParams = httpParams.set('BatchId', params.BatchId);
    }

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}GetAssessment`, { params: httpParams });
  }

  // Delete assessment
  deleteAssessment(data: DeleteAssessment): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteAssessment`, { body: data });
  }

  // Approve assessment
  approveAssessment(data: ApproveAssessment): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}ApproveAssessment`, data);
  }
}

