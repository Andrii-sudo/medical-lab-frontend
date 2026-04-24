import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ModalComponent } from "@shared/components/modal/modal.component";

@Component
({
  	selector: 'app-login',
	imports: [ReactiveFormsModule, ModalComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent 
{
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);
	
	loginForm!: FormGroup;
	
	isPatient = false; 
	showPassword = false;
	errorMessage = '';

	constructor()
    {
        const navState = history.state;
        if (navState && navState.isPatient !== undefined)
        {
            this.isPatient = navState.isPatient;
        }

		if (this.isPatient) 
        {
            this.loginForm = this.fb.group(
			{
                phone: ['', [Validators.required]], 
                password: ['', [Validators.required, Validators.minLength(6)]]
            });
        } 
        else 
        {
            this.loginForm = this.fb.group(
			{
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]]
            });
        }
    }

	togglePassword(): void
	{
		this.showPassword = !this.showPassword;
	}

	onSubmit(): void
	{
		if (!this.loginForm.valid)
		{
			this.loginForm.markAllAsTouched();
			return;
		}
		
		if (this.isPatient)
		{
			const data = this.loginForm.value;
			this.authService.loginPatient(data.phone!, data.password!)
				.subscribe(
				{ 
					next: () => 
					{
						this.router.navigate(['/analyses']);
					}, 
					error: err => 
					{
						console.error(err);
						this.errorMessage = err.error.msg;
					} 
				});
		}
		else
		{
			const data = this.loginForm.value;
			this.authService.loginEmployee(data.email!, data.password!)
				.subscribe(
				{ 
					next: () => 
					{
						this.router.navigate(['/patients']);
					}, 
					error: err => 
					{
						console.error(err);
						this.errorMessage = err.error.msg;
					} 
				});
		}
	}
}
