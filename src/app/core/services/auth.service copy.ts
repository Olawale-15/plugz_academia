import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { BaseApiUrlService } from "./baseapiurl.service";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string;

  constructor(private http: HttpClient, private apiUrlService: BaseApiUrlService) {
    this.baseUrl = this.apiUrlService.Url + 'Auth/';
  }
  verifyUser(token: string): Observable<any> {
    return this.http.get<any>(
      `https://academia.supportdom.com/api/Auth/VerifyUser?Token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }



}
