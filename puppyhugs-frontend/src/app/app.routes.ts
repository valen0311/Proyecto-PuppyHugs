// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. Importamos los componentes "Layout" y "Públicos"
// (Usamos import estático aquí porque son la base)
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';

export const routes: Routes = [

  // --- RUTA PÚBLICA: LOGIN ---
  {
    path: 'login',
    component: LoginComponent
  },

  // --- RUTA PÚBLICA: REGISTRO (La crearemos después) ---
  // (La definimos ahora para que la app la conozca)
  {
    path: 'register',
    // Usamos 'loadComponent' (Lazy Loading)
    // El componente solo se descarga si el usuario visita /register
    loadComponent: () => import('./components/public/register/register.component')
                         .then(m => m.RegisterComponent)
  },

  // --- ÁREA DE ADMINISTRADOR (PROPIETARIO) ---
  {
    path: 'admin',
    component: AdminLayoutComponent, // 1. Carga el "Marco" o "Layout"
    // 2. 'children' son las páginas que se cargarán DENTRO del <router-outlet>
    //    del AdminLayoutComponent.
    children: [
      {
        path: 'dashboard', // Ruta: /admin/dashboard
        loadComponent: () => import('./components/admin/dashboard-admin/dashboard-admin.component')
                             .then(m => m.DashboardAdminComponent)
      },
      {
        path: 'productos', // Ruta: /admin/productos
        loadComponent: () => import('./components/admin/productos-admin/productos-admin.component')
                             .then(m => m.ProductosAdminComponent)
      },
      {
        path: 'promociones', // Ruta: /admin/promociones
        loadComponent: () => import('./components/admin/promociones-admin/promociones-admin.component')
                             .then(m => m.PromocionesAdminComponent)
      },
      {
        path: 'proveedores', // Ruta: /admin/proveedores
        loadComponent: () => import('./components/admin/proveedores-admin/proveedores-admin.component')
                             .then(m => m.ProveedoresAdminComponent)
      },
      {
        path: 'ventas', // Ruta: /admin/ventas
        loadComponent: () => import('./components/admin/ventas-admin/ventas-admin.component')
                             .then(m => m.VentasAdminComponent)
      },
      {
        path: 'usuarios', // Ruta: /admin/usuarios (Clientes)
        loadComponent: () => import('./components/admin/usuarios-admin/usuarios-admin.component')
                             .then(m => m.UsuariosAdminComponent)
      },
      // Si alguien entra a /admin (solo), lo redirigimos a /admin/dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // --- RUTAS POR DEFECTO ---

  // Si alguien entra a la raíz (''), lo redirigimos a /login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Si la URL no coincide con nada (Wildcard), lo mandamos a /login
  {
    path: '**',
    redirectTo: 'login'
  }
];
