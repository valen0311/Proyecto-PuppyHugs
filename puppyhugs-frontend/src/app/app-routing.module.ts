import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// --- IMPORTAMOS TODOS LOS COMPONENTES QUE ACTUARÁN COMO "PÁGINAS" ---

// 1. Componentes de Autenticación
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// 2. Componentes del Administrador
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { ProductosAdminComponent } from './productos-admin/productos-admin.component';
import { ProveedoresAdminComponent } from './proveedores-admin/proveedores-admin.component';
import { PromocionesAdminComponent } from './promociones-admin/promociones-admin.component';
import { UsuariosAdminComponent } from './usuarios-admin/usuarios-admin.component';
import { VentasAdminComponent } from './ventas-admin/ventas-admin.component';

// 3. Componentes del Cliente
import { TiendaClienteComponent } from './tienda-cliente/tienda-cliente.component';
import { CarritoClienteComponent } from './carrito-cliente/carrito-cliente.component';

// 4. (Este será el "Vigilante" que crearemos en el Paso 4 para proteger rutas)
// import { guardiaAdmin } from './services/autenticacion.guard';


// --- ESTE ES EL MAPA DE RUTAS ---
const routes: Routes = [

  // --- Rutas Públicas (Login y Registro) ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- Rutas del Administrador (Protegidas) ---
  // (Nota: Descomentaremos el 'canActivate' cuando creemos el guardia)
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    // canActivate: [guardiaAdmin]
  },
  {
    path: 'productos-admin',
    component: ProductosAdminComponent,
    // canActivate: [guardiaAdmin]
  },
  {
    path: 'proveedores-admin',
    component: ProveedoresAdminComponent,
    // canActivate: [guardiaAdmin]
  },
  {
    path: 'promociones-admin',
    component: PromocionesAdminComponent,
    // canActivate: [guardiaAdmin]
  },
  {
    path: 'usuarios-admin',
    component: UsuariosAdminComponent,
    // canActivate: [guardiaAdmin]
  },
  {
    path: 'ventas-admin',
    component: VentasAdminComponent,
    // canActivate: [guardiaAdmin]
  },

  // --- Rutas del Cliente (Protegidas) ---
  // (Nota: Necesitaríamos un 'guardiaCliente' en el futuro)
  { path: 'tienda-cliente', component: TiendaClienteComponent },
  { path: 'carrito-cliente', component: CarritoClienteComponent },


  // --- Rutas por Defecto ---

  // Si el usuario entra a la raíz (ej: localhost:4200)
  // lo redirigimos al login.
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Si el usuario escribe una URL que no existe
  // lo redirigimos al login.
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
