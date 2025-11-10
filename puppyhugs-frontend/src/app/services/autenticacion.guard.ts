// Archivo: src/app/services/autenticacion.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// Importamos nuestro servicio, que tiene la lógica de "esAdmin()"
import { AutenticacionService } from './autenticacion.service';

/**
 * Este es un "Guardia de Ruta" funcional (el estilo moderno de Angular).
 * Es una simple función que el Router ejecutará antes de cargar una ruta.
 * * Lo nombramos 'guardiaAdmin' para que sea claro qué protege.
 */
export const guardiaAdmin: CanActivateFn = (route, state) => {

  // 1. Obtenemos las dependencias que necesitamos usando 'inject'
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  // 2. Usamos el método 'esAdmin()' que creamos en el servicio
  if (autenticacionService.esAdmin()) {
    // Si el método devuelve 'true' (porque el rol es ROL_ADMIN),
    // dejamos que el usuario continúe a la ruta.
    return true;
  } else {
    // Si no es Admin (o no está logueado),
    // lo redirigimos a la página de login.
    console.log("Acceso denegado. No es admin.");
    router.navigate(['/login']);

    // Y bloqueamos el acceso a la ruta protegida.
    return false;
  }
};
