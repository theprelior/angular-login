import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; 
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  
  constructor(private apiService: ApiService,private authService: AuthService, private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.apiService.login(loginData).subscribe(response => {
      if (response.success) {
        alert('Login successful!');
        console.log(response);
        this.authService.setToken(response.token);
        this.authService.setUsername(response.username);
        this.router.navigate(['/']);
      } else {
        alert('Invalid credentials');
      }
    }, error => {
      console.error('Login failed', error);
      alert('An error occurred during login');
    });
  }
}
