import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { useState } from 'react';
const alertSubject = new Subject();
const defaultId = 'default-alert';

const options = {
    autoClose: false,
    keepAfterRouteChange: false
  };
export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
}

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
    return alertSubject.asObservable().pipe(filter(x => x && x.id === id));
}

// convenience methods
function success(message) {
    alert({ ...options, type: AlertType.Success, message });
}

function error(message) {
    alert({ ...options, type: AlertType.Error, message });
}

function info(message) {
    alert({ ...options, type: AlertType.Info, message });
}

function warn(message) {
    alert({ ...options, type: AlertType.Warning, message });
}

// core alert method
function alert(alert) {
    alert.id = alert.id || defaultId;
    alertSubject.next(alert);
}

// clear alerts
function clear(id = defaultId) {
    alertSubject.next({ id });
}