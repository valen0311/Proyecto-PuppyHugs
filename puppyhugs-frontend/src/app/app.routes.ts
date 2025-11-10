// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. IMPORTAMOS LOS COMPONENTES "ESTÁTICOS"
import { LoginComponent } from './components/public/login/login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [

  // --- RUTA PÚBLICA: LOGIN ---
  {
    path: 'login',
    component: LoginComponent
  },

  // --- RUTA PÚBLICA: REGISTRO ---
  { // ¡Descomentado!
    path: 'register',
    loadComponent: () => import('./components/public/register/register.component')
                         .then(m => m.RegisterComponent)
  },

  // --- ÁREA DE ADMINISTRADOR (PROPIETARIO) ---
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard', // Ruta: /admin/dashboard
        component: DashboardAdminComponent
      },
      { // ¡Descomentado!
        path: 'productos', // Ruta: /admin/productos
        loadComponent: () => import('./components/admin/productos-admin/productos-admin.component')
                             .then(m => m.ProductosAdminComponent)
      },
      { // ¡Descomentado!
        path: 'promociones', // Ruta: /admin/promociones
        loadComponent: () => import('./components/admin/promociones-admin/promociones-admin.component')
                             .then(m => m.PromocionesAdminComponent)
      },
      { // ¡Añadido!
        path: 'proveedores', // Ruta: /admin/proveedores
        loadComponent: () => import('./components/admin/proveedores-admin/proveedores-admin.component')
                             .then(m => m.ProveedoresAdminComponent)
      },
      { // ¡Añadido!
        path: 'ventas', // Ruta: /admin/ventas
        loadComponent: () => import('./components/admin/ventas-admin/ventas-admin.component')
                             .then(m => m.VentasAdminComponent)
      },
      { // ¡Añadido!
        path: 'usuarios', // Ruta: /admin/usuarios (Clientes)
        loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component')
                             .then(m => m.UsuariosAdminComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // --- RUTAS POR DEFECTO ---
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
