import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

	loginForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]]
	});
	
	showPassword = false;
	loginError = false;

	onSubmit()
	{
		if (!this.loginForm.valid)
		{
			this.loginForm.markAllAsTouched();
			return;
		}
		
		console.log(this.loginForm.value);	
		this.router.navigate(['/dashboard']);
		
	}

	togglePassword()
	{
		this.showPassword = !this.showPassword;
	}
}
