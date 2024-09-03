import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false; 
  username: string | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription.add(
      this.authService.authStatus$.subscribe(status => {
        this.isLoggedIn = status;
      })
    );

    this.authSubscription.add(
      this.authService.authuserName$.subscribe(username => {
        this.username = username;
      })
    );
  }

  logout(): void {
    this.authService.clear();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
