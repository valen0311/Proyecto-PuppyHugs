import { guardiaAdmin } from './services/autenticacion.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [guardiaAdmin] // <-- ¡Aquí se usa el guardia!
  },
  {
    path: 'productos-admin',
    component: ProductosAdminComponent,
    canActivate: [guardiaAdmin] // <-- ¡Protegido!
  }
  // ...
];
