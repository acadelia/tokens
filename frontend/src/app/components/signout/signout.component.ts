import { Component } from '@angular/core';
import { LoginService } from '../../services/requests/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent {
  constructor(private auth: LoginService) {}
  signOut() {
    this.auth.signout();
  }
}
