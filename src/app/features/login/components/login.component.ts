import { Component } from '@angular/core';
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
	loginForm: FormGroup;
	showPassword = false;
	loginError = false;

	constructor(private fb: FormBuilder, private router: Router)
	{
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	onSubmit()
	{
		if (!this.loginForm.valid)
		{
			this.loginForm.markAllAsTouched();
		}
		else
		{
			console.log(this.loginForm.value);
			
			this.router.navigate(['/dashboard']);
		}
	}

	togglePassword()
	{
		this.showPassword = !this.showPassword;		
	}
}
