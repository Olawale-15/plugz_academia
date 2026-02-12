import {
  NewStudent,
  UpdateStudent,
  UpdateStudentStatus,
  GetStudentParams,
  StudentResponse,
  DeleteStudent,
  NewEnrollment,
  UpdateEnrollment,
  UpdateEnrollmentStatus,
  GetEnrollmentParams,
  EnrollmentResponse,
  DeleteEnrollment
} from '../models/enrollment.model';
import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private baseUrl: string;

  constructor(private http: HttpClient, private apiUrlService: BaseApiUrlService) {
    this.baseUrl = this.apiUrlService.Url + 'Enrollment/';
  }

  /* Student Methods */

  // Create new student
  newStudent(data: NewStudent): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewStudent`, data);
  }

  // Update student
  updateStudent(data: UpdateStudent): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateStudent`, data);
  }

  // Update student status
  updateStudentStatus(data: UpdateStudentStatus): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}UpdateStudentStatus`, data);
  }

  // Get student list or single student
  getStudent(params: GetStudentParams): Observable<ApiResponse<StudentResponse[]>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);

    if (params.StudentId) httpParams = httpParams.set('StudentId', params.StudentId);
    if (params.Studentname) httpParams = httpParams.set('Studentname', params.Studentname);
    if (params.Email) httpParams = httpParams.set('Email', params.Email);
    if (params.Telephone) httpParams = httpParams.set('Telephone', params.Telephone);
    if (params.StudentStatus) httpParams = httpParams.set('StudentStatus', params.StudentStatus);

    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}GetStudent`, { params: httpParams });
  }

  // Delete student
  deleteStudent(data: DeleteStudent): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteStudent`, { body: data });
  }

  /* Enrollment Methods */

  // Create new enrollment
  newEnrollment(data: NewEnrollment[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewEnrollment`, data);
  }

  // Update enrollment
  updateEnrollment(data: UpdateEnrollment): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateEnrollment`, data);
  }

  // Update enrollment status
  updateEnrollmentStatus(data: UpdateEnrollmentStatus): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}UpdateEnrollmentStatus`, data);
  }

  // Get enrollment list or single enrollment
  getEnrollment(params: GetEnrollmentParams): Observable<ApiResponse<EnrollmentResponse[]>> {
    let httpParams = new HttpParams()
      .set('MerchantId', params.MerchantId);

    if (params.EnrollmentId) httpParams = httpParams.set('EnrollmentId', params.EnrollmentId);
    if (params.StudentId) httpParams = httpParams.set('StudentId', params.StudentId);
    if (params.StudentName) httpParams = httpParams.set('StudentName', params.StudentName);
    if (params.ProgrammeId) httpParams = httpParams.set('ProgrammeId', params.ProgrammeId);
    if (params.AcademicSession) httpParams = httpParams.set('AcademicSession', params.AcademicSession);
    if (params.AcademicTerm) httpParams = httpParams.set('AcademicTerm', params.AcademicTerm);
    if (params.ClassId) httpParams = httpParams.set('ClassId', params.ClassId);
    if (params.SubClassId) httpParams = httpParams.set('SubClassId', params.SubClassId);
    if (params.EnrolmentStatus) httpParams = httpParams.set('EnrolmentStatus', params.EnrolmentStatus);

    return this.http.get<ApiResponse<EnrollmentResponse[]>>(`${this.baseUrl}GetEnrollment`, { params: httpParams });
  }

  // Delete enrollment
  deleteEnrollment(data: DeleteEnrollment): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteEnrollment`, { body: data });
  }
}
