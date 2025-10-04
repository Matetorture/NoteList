import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, AlertData } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert implements OnInit, OnDestroy {
  alerts: AlertData[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription.add(
      this.alertService.alerts$.subscribe((alerts: AlertData[]) => {
        this.alerts = alerts;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onConfirm(alert: AlertData) {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    this.alertService.removeAlert(alert.id);
  }

  onCancel(alert: AlertData) {
    if (alert.onCancel) {
      alert.onCancel();
    }
    this.alertService.removeAlert(alert.id);
  }

  onClose(alert: AlertData) {
    this.alertService.removeAlert(alert.id);
  }
}
