import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { keysConfig } from 'src/app/keys.config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  done: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private alertService: AlertService,
    private appSettings: AppSettingsService
  ) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    // get return url from route parameters or default to '/'
    const queryParams = this.route.snapshot.queryParams;
    this.returnUrl = queryParams[keysConfig.RETURN_URL_KEY] || '/';
    this.done = queryParams.done === '1';
  }

  get c() {
    return this.resetForm.controls;
  }

  sendResetEmail() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this.loading = true;
    this.auth.sendPasswordResetEmail(this.c.email.value)
      .then(
        () => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              ...this.route.snapshot.queryParams,
              done: 1
            }
          });
        },
        err => {
          // this.alertService.error(error);
          if (!environment.production) { console.error(err); }
          this.loading = false;
        }
      );
  }

}
