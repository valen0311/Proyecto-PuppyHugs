/// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. IMPORTAMOS LOS COMPONENTES "ESTÁTICOS"
import { LoginComponent } from './public/login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ClienteLayoutComponent } from './public/cliente-layout/cliente-layout.component';
// Se eliminan los imports de las vistas que se cargan con loadComponent

 export const routes: Routes = [

   // --- RUTA PÚBLICA: LOGIN ---
   {
     path: 'login',
     component: LoginComponent
   },

   // --- RUTA PÚBLICA: REGISTRO ---
   { // ¡Descomentado!
     path: 'register',
     loadComponent: () => import('./public/register/register.component')
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
         loadComponent: () => import('./admin/productos-admin/productos-admin.component')
                              .then(m => m.ProductosAdminComponent)
       },
       { // ¡Descomentado!
         path: 'promociones', // Ruta: /admin/promociones
         loadComponent: () => import('./admin/promociones-admin/promociones-admin.component')
                              .then(m => m.PromocionesAdminComponent)
       },
       { // ¡Añadido!
         path: 'proveedores', // Ruta: /admin/proveedores
         loadComponent: () => import('./admin/proveedores-admin/proveedores-admin.component')
                              .then(m => m.ProveedoresAdminComponent)
       },
       { // ¡Añadido!
         path: 'ventas', // Ruta: /admin/ventas
         loadComponent: () => import('./admin/ventas-admin/ventas-admin.component')
                              .then(m => m.VentasAdminComponent)
       },
       { // ¡Añadido!
         path: 'usuarios', // Ruta: /admin/usuarios (Clientes)
         loadComponent: () => import('./admin/usuarios-admin/usuarios-admin.component')
                              .then(m => m.UsuariosAdminComponent)
       },
       { // ¡Actualizado!
         path: 'pagos', // Ruta: /admin/pagos
         loadComponent: () => import('./admin/pago/pago-admin.component')
                              .then(m => m.PagoAdminComponent)
       },

       {
         path: '',
         redirectTo: 'dashboard',
         pathMatch: 'full'
       }
     ]
  },

  // --- ÁREA DE CLIENTE ---
  {
    path: 'cliente',
    component: ClienteLayoutComponent,
    children: [
      {
        path: 'pago', // Ruta: /cliente/pago
        loadComponent: () => import('./public/realizar-pago/realizar-pago.component')
                             .then(m => m.RealizarPagoComponent)
      },
      {
        path: 'factura', // Ruta: /cliente/factura
        loadComponent: () => import('./public/ver-factura/ver-factura.component')
                             .then(m => m.VerFacturaComponent)
      },
      {
        path: 'mis-pagos', // 🆕 NUEVA RUTA: /cliente/mis-pagos
        loadComponent: () => import('./public/mis-pagos/mis-pagos.component')
                             .then(m => m.MisPagosComponent)
      },
      {
        path: '',
        redirectTo: 'pago',
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

];