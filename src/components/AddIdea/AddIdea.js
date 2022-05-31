import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ethers } from "ethers";
import IdeaBoard from '../../utils/IdeaBoard.json';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import {alertService} from '../../components/Alert/alert.service';
import { trackPromise } from 'react-promise-tracker';



export default function AddIdea(){
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract("0x4bD1177a4B59bB9E26f32F43c78BB2760a42006C", IdeaBoard.abi, signer);
            try{
                let createTxn = await connectedContract.createIdea(form.elements.ideaTitle.value, form.elements.ideaDescription.value); 
                await trackPromise(createTxn.wait());
            }
            catch(err){
                console.log(err);
                alertService.error("Error while creating idea, please try again!");
            }
            console.log("ideaCreated")

        } else {
            <Alert>
                Make sure you have metamask!
            </Alert>
        }        
        setValidated(true);
        navigate("/");
      };
    
    return (
        <div>
            <h1>Add an idea</h1>
            <Form noValidate validated={validated} className='addIdeaForm' onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="ideaTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control required type="text" maxlength="50" placeholder="Enter the Tite" />
                    <Form.Text className="text-muted">
                    Please limit this to 5-6words.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="ideaDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control required as="textarea" maxlength="250" rows={5} placeholder="Enter the Description" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}