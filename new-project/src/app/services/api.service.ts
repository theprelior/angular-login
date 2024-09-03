import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/values'; // API url

  constructor(private http: HttpClient) { }


  getValues(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }


  submitForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }
}
