import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // Esta es la etiqueta principal en index.html
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Dejamos un título por si acaso, pero no lo usamos
  title = 'puppyhugs-frontend';
}
