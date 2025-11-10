import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from './autenticacion.service'; // Importamos nuestro servicio

/**
 * Este es un "Guardia de Ruta" funcional.
 * Es una simple función que Angular ejecutará antes de cargar una ruta.
 */
export const guardiaAdmin: CanActivateFn = (route, state) => {

  // 1. Obtenemos las dependencias que necesitamos
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  // 2. Usamos el método 'esAdmin()' que creamos en el servicio
  if (autenticacionService.esAdmin()) {
    // Si el método devuelve 'true', el usuario es Admin.
    // Dejamos que continúe a la ruta.
    return true;
  } else {
    // Si no es Admin (o no está logueado),
    // lo redirigimos a la página de login.
    router.navigate(['/login']);

    // Y bloqueamos el acceso a la ruta protegida.
    return false;
  }
