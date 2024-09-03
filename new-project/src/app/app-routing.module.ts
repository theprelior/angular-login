import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component'; 
import { LoginComponent } from './login/login.component'; 
import { AuthGuard } from './auth.guard'; 

const routes: Routes = [
  { path: 'login', component: LoginComponent,canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] }
  //{ path: '', redirectTo: '/register', pathMatch: 'full' } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
