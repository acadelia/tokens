import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/requests/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  email!: string;
  password!: string;
  errorMessage!: string;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private auth: LoginService
  ) {}

  ngOnInit() {
    const token = this.tokenService.getToken();

    if (token) {
      this.router.navigateByUrl('/home');
    }
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }
}
