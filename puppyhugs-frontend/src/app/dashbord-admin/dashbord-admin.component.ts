import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  // No necesitamos lógica especial para esta vista.
  // El sidebar que incluimos en el HTML tiene su propia lógica.
  constructor() { }

}
