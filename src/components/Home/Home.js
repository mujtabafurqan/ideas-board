import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import IdeaBoard from '../../utils/IdeaBoard.json';
import { ethers } from "ethers";
import './Home.css';
import {alertService} from '../../components/Alert/alert.service';
import { trackPromise } from 'react-promise-tracker';

export default function Home(){

    const navigate = useNavigate();
    const CONTRACT_ADDRESS = "0x4bD1177a4B59bB9E26f32F43c78BB2760a42006C";

    const [ideaList, setIdeaList] = useState([]);
    const [hasAccess, setHasAccess] = useState(false);
    const [receipt, setReceipt] = useState("");


    useEffect (() => {
        console.log(receipt, "recipt after the trx")
        fetchIdeas();
    }, [receipt])
    
    


    const getContract = () => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaBoard.abi, signer);
            return connectedContract;
        } else {
            alertService.error("Make sure you have metamask!");
        }
    } 
    const upvote = async (id) => {
        try{
            const connectedContract = getContract();
            let upvoteTxn = await connectedContract.upvote(id);
            const receipt = await trackPromise(upvoteTxn.wait());
            setReceipt(receipt)
            console.log(`Upvoted, see transaction: https://rinkeby.etherscan.io/tx/${upvoteTxn.hash}`);
        }
        catch(err){
            console.log(err);
            alertService.error("Error while upvoting, please try again!");
        }
    }

    const downvote = async (id) => {
        try{
        const connectedContract = getContract();
        let downvoteTxn = await connectedContract.downvote(id);
        const receipt = await trackPromise(downvoteTxn.wait());
        setReceipt(receipt)
        console.log(`Downvoted, see transaction: https://rinkeby.etherscan.io/tx/${downvoteTxn.hash}`);
        }
        catch(err){
            console.log(err);
            alertService.info("Error while downvoting, please try again!");
        }
    }

    useEffect (() => {
        checkAccess();
        fetchIdeas();
        console.log("Fetching ideas...",ideaList);
    },[]);

    const fetchIdeas = async () => {
        try{
            const connectedContract = getContract();
            const ideaArr=[];
            for(let i = 0; i < 100; i++) {
                const idea = await trackPromise(connectedContract.getIdea(i));
                console.log("idea:",idea)
                if(idea[3]=== "")
                    break;
                ideaArr.push(idea);
            }
            setIdeaList([...ideaList,...ideaArr]);
        }
        catch(err){
            console.log(err);
            alertService.warn("Fetching Ideas not possible without NFT ownership");
        }
    }

    const checkAccess = async () => {
        try{
            const connectedContract = getContract();
            const hasAccess = await trackPromise(connectedContract.hasAccess());
            console.log("hasAccess:",hasAccess);
            setHasAccess(hasAccess);
        }
        catch(err){
            console.log(err);
            alertService.error("Error while checking access, please try again!");
        }
    }

    const addIdea = () => {
        if(hasAccess){
            navigate("addIdea");
        }else{
            alertService.error("You don't have access to this feauture. Please mint an NFT to get access.");
        }
    }
    return (
        <div className='homeDiv'>
            <button onClick={addIdea} className='cta-button connect-wallet-button'>
                Add an idea
            </button>
            {ideaList.length === 0 && <h1>No Ideas yet. Please add yours!</h1>}
            {ideaList.map((idea, index) => {
                return(
                    <Card style={{ width: '70%', border: '1px solid grey', borderRadius: '30px', margin: '20px' }}>
                        <Card.Body>
                        <Card.Title>#{(idea[0].toNumber()+1)} : {idea[3]}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{idea[5]}</Card.Subtitle>
                        <Card.Text>
                            {idea[4]}
                        </Card.Text>
                           {hasAccess &&
                                <div className='upvoteDownvoteDiv'>
                                <button onClick={() => upvote(index)} className="cta-button connect-wallet-button">
                                    Upvote : {idea[1].toNumber()}
                                </button>
                                <button onClick={() => downvote(index)} className="cta-button connect-wallet-button">
                                    Downvote : {idea[2].toNumber()}
                                </button>
                                </div>
                          }
                        </Card.Body>
                    </Card>
                )
            })}
        </div>
    )
}