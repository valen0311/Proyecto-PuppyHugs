// src/app/components/admin/admin-layout/admin-layout.component.ts

import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SidebarAdminComponent } from '../../shared/sidebar-admin/sidebar-admin.component';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarAdminComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); // ✅ AÑADIDO

  public adminUser: Cliente | null = null;

  ngOnInit(): void {
    // ✅ PROTECCIÓN SSR: Solo ejecutar en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return; // Si estamos en el servidor, no hacer nada
    }

    const userStorage = localStorage.getItem('usuarioLogueado');

    if (!userStorage) {
      this.router.navigate(['/login']);
      return;
    }

    const user: Cliente = JSON.parse(userStorage);

    if (user.rol !== 'ROL_ADMIN') {
      console.warn('Acceso denegado: Se requiere ROL_ADMIN.');
      this.router.navigate(['/login']);
      return;
    }

    this.adminUser = user;
  }

  public onLogout(): void {
    // ✅ PROTECCIÓN SSR
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogueado');
    }
    this.router.navigate(['/login']);
  }
}
