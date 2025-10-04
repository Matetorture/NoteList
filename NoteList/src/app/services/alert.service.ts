import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<AlertData[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  success(title: string, message: string): void {
    const alert: AlertData = {
      id: this.generateId(),
      type: 'success',
      title,
      message
    };
    this.addAlert(alert);
    
    setTimeout(() => {
      this.removeAlert(alert.id);
    }, 1500);
  }

  error(title: string, message: string): void {
    const alert: AlertData = {
      id: this.generateId(),
      type: 'error',
      title,
      message
    };
    this.addAlert(alert);
  }

  warning(title: string, message: string): void {
    const alert: AlertData = {
      id: this.generateId(),
      type: 'warning',
      title,
      message
    };
    this.addAlert(alert);
  }

  info(title: string, message: string): string {
    const alert: AlertData = {
      id: this.generateId(),
      type: 'info',
      title,
      message
    };
    this.addAlert(alert);
    return alert.id;
  }

  confirm(title: string, message: string, onConfirm?: () => void, onCancel?: () => void): void {
    const alert: AlertData = {
      id: this.generateId(),
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel
    };
    this.addAlert(alert);
  }

  private addAlert(alert: AlertData): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    const filteredAlerts = currentAlerts.filter(alert => alert.id !== id);
    this.alertsSubject.next(filteredAlerts);
  }

  clearAll(): void {
    this.alertsSubject.next([]);
  }
}