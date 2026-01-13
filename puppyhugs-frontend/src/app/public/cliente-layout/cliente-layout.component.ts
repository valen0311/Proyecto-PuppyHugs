// src/app/public/cliente-layout/cliente-layout.component.ts

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './cliente-layout.component.html',
  styleUrl: './cliente-layout.component.css'
})
export class ClienteLayoutComponent implements OnInit {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public clienteUser: Cliente | null = null;

  ngOnInit(): void {
    // Protección SSR: Solo ejecutar en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userStorage = localStorage.getItem('usuarioLogueado');

    if (!userStorage) {
      this.router.navigate(['/login']);
      return;
    }

    const user: Cliente = JSON.parse(userStorage);

    if (user.rol !== 'ROL_CLIENTE') {
      console.warn('Acceso denegado: Se requiere ROL_CLIENTE.');
      this.router.navigate(['/login']);
      return;
    }

    this.clienteUser = user;
  }

  public onLogout(): void {
    // Protección SSR
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogueado');
    }
    this.router.navigate(['/login']);
  }
}
