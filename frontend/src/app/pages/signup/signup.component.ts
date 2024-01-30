import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/requests/auth.service';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private auth: LoginService,
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
    });
  }

  ngOnInit() {
    const token = this.tokenService.getToken();

    if (token) {
      this.router.navigateByUrl('/home');
    }
  }

  passwordValidator(control: AbstractControl) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(control.value);
    const hasNumber = /\d/.test(control.value);

    if (!control.value) {
      return { required: true }; // Password is required
    } else if (control.value.length < 8) {
      return { minlength: true }; // Password length is less than 8 characters
    } else if (!(hasSymbol && hasNumber)) {
      return { invalidPassword: true }; // Invalid password format (missing symbol or number)
    } else if (!regex.test(control.value)) {
      return { invalidPassword: true }; // Additional check for the regex
    }

    return null; // Validation passed
  }

  get username() {
    return this.signUpForm.get('username');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  onSignUp(): void {
    const { username, email, password } = this.signUpForm.value;
    const formValuesString = JSON.stringify(this.signUpForm.value);

    this.auth.signUpAndLogin(username, email, password).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error(
          'Signup failed!',
          error instanceof Error ? error.message : error
        );
      },
    });
  }
}
