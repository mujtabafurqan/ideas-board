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
    const history = useNavigate();
    const [alerts, setAlerts] = useState([]);
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


    return (
        <div className="alertContainer">
            <div className="m-3">
                {show &&
                <Alert variant="danger">
                    <div className='alertdiv'>
                        {alert.message}
                        <Button onClick={() => setShow(false)} variant="danger">
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