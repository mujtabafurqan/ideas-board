import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [alert, setAlert] = useState({});
    const [show, setShow] = useState(false);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                setAlert(alert);
                setShow(true);
            });


        // clean up function that runs when the component unmounts
        return () => {
            subscription.unsubscribe();

        };
    }, []);

    const getAlertType = (alert) => {
        console.log(alert);
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

    return (
        <div className="alertContainer">
            <div className="m-3">
                {show &&
                <Alert variant={getAlertType(alert)}>
                    <div className='alertdiv'>
                        {alert.message}
                        <Button onClick={() => setShow(false)} variant={getAlertType(alert)}>
                            Close
                        </Button>
                    </div>
                </Alert>
                }          
            </div>
        </div>
    );
}

AlertComp.propTypes = propTypes;
AlertComp.defaultProps = defaultProps;
export default AlertComp ;