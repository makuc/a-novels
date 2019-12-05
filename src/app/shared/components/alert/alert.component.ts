import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AlertService, Alert } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  message: any = {};
  alert$: Observable<Alert>;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.alert$ = this.alertService.getAlert();
  }

}
