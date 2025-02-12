import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AlertService, Alert } from 'src/app/core/services/alert.service';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';

import { keysConfig } from 'src/app/keys.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private appSettings: AppSettingsService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams[keysConfig.RETURN_URL_KEY] || '/';
  }

  get c() {
    return this.loginForm.controls;
  }

  loginEmail() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authenticationService.loginEmail(this.c.email.value, this.c.password.value)
      .then(
        data => {
          this.loading = false;
          if (data.uid) {
            this.router.navigate([this.returnUrl]);
          } else if (data.code === 'auth/wrong-password') {
            this.alertService.error('Wrong password or wrong login method');
          } else if (data.code === 'auth/user-not-found') {
            this.alertService.error('User with associated email doesn\'t exist');
          } else if (data.code === 'auth/too-many-requests') {
            this.alertService.error('Too many unsuccessful login attempts');
          } else {
            console.error('Invalid login data:', data);
          }
        },
        err => {
          // this.alertService.error(error);
          console.error(err);
          this.loading = false;
        }
      );
  }

  loginGoogle() {
    this.authenticationService.loginGoogle()
      .then(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        err => {
          if (!environment.production) { console.error(err); }
        }
      );
  }

  loginFacebook() {
    this.authenticationService.loginFacebook()
    .then(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      err => {
        if (!environment.production) { console.error(err); }
      }
    );
  }

}
