// Archivo: src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// --- MÓDULOS ESENCIALES ---
// 1. Para que funcionen las rutas (el AppRoutingModule que creaste)
import { AppRoutingModule } from './app-routing.module';
// 2. Para que los formularios (formGroup) funcionen
import { ReactiveFormsModule } from '@angular/forms';
// 3. Para que los Servicios puedan llamar a tu API (HttpClient)
import { HttpClientModule } from '@angular/common/http';

// --- COMPONENTES PRINCIPALES (Páginas y Vistas) ---
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { ProductosAdminComponent } from './productos-admin/productos-admin.component';
import { ProveedoresAdminComponent } from './proveedores-admin/proveedores-admin.component';
import { PromocionesAdminComponent } from './promociones-admin/promociones-admin.component';
import { UsuariosAdminComponent } from './usuarios-admin/usuarios-admin.component';
import { VentasAdminComponent } from './ventas-admin/ventas-admin.component';
import { TiendaClienteComponent } from './tienda-cliente/tienda-cliente.component';
import { CarritoClienteComponent } from './carrito-cliente/carrito-cliente.component';

// --- COMPONENTES TIPO "DIALOG" (Ventanas emergentes) ---
import { CrearProductoDialogComponent } from './crear-producto-dialog/crear-producto-dialog.component';
import { CrearPromocionDialogComponent } from './crear-promocion-dialog/crear-promocion-dialog.component';
import { CrearProveedorDialogComponent } from './crear-proveedor-dialog/crear-proveedor-dialog.component';
import { RegistrarPagoDialogComponent } from './registrar-pago-dialog/registrar-pago-dialog.component';
import { EliminarDialogComponent } from './eliminar-dialog/eliminar-dialog.component';


@NgModule({
  declarations: [
    // --- Todos tus componentes deben estar listados aquí ---
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardAdminComponent,
    SidebarAdminComponent,
    ProductosAdminComponent,
    ProveedoresAdminComponent,
    PromocionesAdminComponent,
    UsuariosAdminComponent,
    VentasAdminComponent,
    TiendaClienteComponent,
    CarritoClienteComponent,
    CrearProductoDialogComponent,
    CrearPromocionDialogComponent,
    CrearProveedorDialogComponent,
    RegistrarPagoDialogComponent,
    EliminarDialogComponent
  ],
  imports: [
    // --- Todos los módulos (herramientas) deben estar aquí ---
    BrowserModule,
    AppRoutingModule,   // El módulo de rutas
    ReactiveFormsModule, // El módulo de formularios
    HttpClientModule    // El módulo para llamar a la API
  ],
  providers: [
    // (Aquí irían los servicios si no usaran 'providedIn: root')
  ],
  bootstrap: [AppComponent] // El componente que inicia todo
})
export class AppModule { }
