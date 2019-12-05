import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { MustMatch } from 'src/app/shared/directives/password-match.directive';
import { keysConfig } from 'src/app/keys.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnURL: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.returnURL = this.route.snapshot.queryParams[keysConfig.RETURN_URL_KEY] || '/';

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
        validators: MustMatch('password', 'confirm')
      });
  }
  // convenient getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    console.log('register?');

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.createEmail(this.f.email.value, this.f.password.value).then(
      user => {
        // this.alertService.success('Registration successful', true);
        this.router.navigate([ this.returnURL ]);
      },
      error => {
        // this.alertService.error(error);
        console.log(error);
        this.loading = false;
      }
    );
  }

}
