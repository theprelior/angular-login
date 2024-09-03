import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private usernameKey = 'authUsername';
  
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();
  private authuserName = new BehaviorSubject<string | null>(this.getUsername());
  authuserName$ = this.authuserName.asObservable();

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
    this.authuserName.next(username);
    this.authStatus.next(true);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.authuserName.next(null);
    this.authStatus.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
