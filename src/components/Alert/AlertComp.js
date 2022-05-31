import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import './AlertComp.css';

import { alertService, AlertType } from './alert.service';

const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    fade: true
};

function AlertComp({ id, fade }) {    
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                setAlerts([...alerts, alert]);
            });


        // clean up function that runs when the component unmounts
        return () => {
            subscription.unsubscribe();

        };
    }, []);

    const getAlertType = (alert) => {
        switch (alert.type) {
            case AlertType.Success:
                return 'success';
            case AlertType.Error:
                return 'danger';
            case AlertType.Info:
                return 'info';
            case AlertType.Warning:
                return 'warning';
            default:
                return 'info';
        }
    }

    const removeAlert = (alert) => {
        setAlerts(alerts.filter(x => x !== alert));
    }

    return (
        <div className="alertContainer">
            <div className="m-3">
                {alerts.map((alert, i) =>{
                 return (
                    <Alert key={i} variant={getAlertType(alert)}>
                        <div className='alertdiv'>
                            {alert.message}
                            <Button onClick={() => removeAlert(alert)} variant={getAlertType(alert)}>
                                Close
                            </Button>
                        </div>
                    </Alert>    
                 )        
                })}                
            </div>
        </div>
    );
}

AlertComp.propTypes = propTypes;
AlertComp.defaultProps = defaultProps;
export default AlertComp ;