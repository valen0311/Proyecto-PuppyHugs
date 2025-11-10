import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 1. Importa los componentes que vas a usar como "páginas"
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// (Aquí importarás el dashboard-admin, tienda-cliente, etc.)

// 2. Define las rutas
const routes: Routes = [
  // Ruta por defecto (si solo ponen localhost:4200)
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta para el Login
  { path: 'login', component: LoginComponent },

  // ¡ESTA ES LA RUTA QUE NECESITAS!
  { path: 'register', component: RegisterComponent },

  // (Aquí irán las rutas de /dashboard-admin, /tienda-cliente, etc.)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
