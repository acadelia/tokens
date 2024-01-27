import { Component } from '@angular/core';
import { LoginService } from '../services/requests/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  email: any;
  password: any;
  constructor(private auth: LoginService) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
