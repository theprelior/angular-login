import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage: string = '';
  values: string[] = [];
  phoneForm: FormGroup;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Turkey, CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) {
    this.phoneForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.apiService.getValues().subscribe(data => {
      this.values = data;
    });
  }

  onSubmit() {
    if (this.phoneForm.invalid) {
      return;
    }

    const formValues = this.phoneForm.value;
    console.log("hi")
   
    if (formValues.password !== formValues.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.apiService.register(formValues).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        alert("You've successfully registered.");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }
}
