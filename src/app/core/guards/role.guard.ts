import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const allowedRoles = route.data?.['roles'] as string[];
  const userRole = authService.getRol();

  if (!userRole || !allowedRoles) {
    return router.navigateByUrl('/dashboard');
  }

  if (allowedRoles.includes(userRole)) {
    return true;
  }

  return router.navigateByUrl('/dashboard');
};