import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // On browser, check authentication
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login using navigateByUrl to avoid loops
  return router.navigateByUrl('/login');
};