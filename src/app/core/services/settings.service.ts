import {
    NewDynamicField,
    UpdateDynamicField,
    GetDynamicFieldsParams,
    DynamicFieldResponse,
    DeleteDynamicField
} from '../models/settings.model';
import { ApiResponse } from '../models/api-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiUrlService } from './baseapiurl.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private baseUrl: string;

    constructor(private http: HttpClient, private apiUrlService: BaseApiUrlService) {
        this.baseUrl = this.apiUrlService.Url + 'Setting/';
    }

    /* Dynamic Field Methods */

    // Create new dynamic field
    newDynamicField(data: NewDynamicField): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}NewDynamicField`, data);
    }

    // Update dynamic field
    updateDynamicField(data: UpdateDynamicField): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.baseUrl}UpdateDynamicField`, data);
    }

    // Get dynamic fields list or single field
    getDynamicFields(params: GetDynamicFieldsParams): Observable<ApiResponse<DynamicFieldResponse[]>> {
        let httpParams = new HttpParams()
            .set('MerchantId', params.MerchantId)
            .set('MetaDataType', params.MetaDataType);

        if (params.ReferenceId) {
            httpParams = httpParams.set('ReferenceId', params.ReferenceId);
        }

        return this.http.get<ApiResponse<DynamicFieldResponse[]>>(`${this.baseUrl}GetDynamicFields`, { params: httpParams });
    }

    // Delete dynamic field
    deleteDynamicField(data: DeleteDynamicField): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}DeleteDynamicField`, { body: data });
    }
}
