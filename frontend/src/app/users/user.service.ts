import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.api}/users`;

  create(dto: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.base, dto);
  }
  list(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.base);
  }
  get(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/${id}`);
  }
  update(id: string, dto: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/${id}`, dto);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
