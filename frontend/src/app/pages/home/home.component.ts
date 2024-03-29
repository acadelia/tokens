import { Component, OnInit } from '@angular/core';
import { DetailsService } from '../../services/requests/details.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  detailsMessage!: object;
  constructor(private details: DetailsService) {}

  ngOnInit(): void {
    this.details.getDetails().subscribe({
      next: (response) => {
        this.detailsMessage = response;
      },
      error: (error) => {
        console.error('Error getting details in component:', error);
      },
    });
  }
}
