import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/auth/auth.service';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  
login(): void {
  if (this.form.invalid) {
    return;
  }

  const loginRequest = {
    username: this.form.value.username!,
    password: this.form.value.password!
  };

  this.authService.login(loginRequest).subscribe({
    next: () => {
     this.router.navigate(['/dashboard']);
      /*this.snackBar.open(
        'Usuario ingreso',
        'Cerrar',
        { duration: 3000 });*/
    },
      error: (err) => {
        this.snackBar.open(
          err.message || 'Usuario o contraseña incorrectos',
          'Cerrar',
          { duration: 3000 }
      );
    }     
  });

  }
}