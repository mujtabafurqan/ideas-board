import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import IdeaBoard from '../../utils/IdeaBoard.json';
import { ethers } from "ethers";
import './Home.css';
import Alert from 'react-bootstrap/Alert';
export default function Home(){

    const navigate = useNavigate();
    const [ideaList, setIdeaList] = useState([]);
    const [hasAccess, setHasAccess] = useState(false);

    const CONTRACT_ADDRESS = "0x4bD1177a4B59bB9E26f32F43c78BB2760a42006C"; 
    const upvote = async (id) => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaBoard.abi, signer);
            let upvoteTxn = await connectedContract.upvote(id);
            await upvoteTxn.wait();
            console.log(`Upvoted, see transaction: https://rinkeby.etherscan.io/tx/${upvoteTxn.hash}`);
        } else {
            <Alert>
                Make sure you have metamask!
            </Alert>
        }
    }

    const downvote = async (id) => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaBoard.abi, signer);
            let downvoteTxn = await connectedContract.downvote(id);
            await downvoteTxn.wait();
            console.log(`Downvoted, see transaction: https://rinkeby.etherscan.io/tx/${downvoteTxn.hash}`);
        } else {
            <Alert>
                Make sure you have metamask!
            </Alert>
        }
    }

    useEffect (() => {
        checkAccess();
        fetchIdeas();
        console.log("Fetching ideas...",ideaList);
    },[]);

    const fetchIdeas = async () => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaBoard.abi, signer);
            const ideaArr=[];
            for(let i = 0; i < 10; i++) {
                const idea = await connectedContract.getIdea(i)
                console.log("idea:",idea)
                if(idea[3]== "")
                    break;
                ideaArr.push(idea);
            }
            setIdeaList(ideaArr);
        } else {
            <Alert>
                Make sure you have metamask!
            </Alert>
        }
    }

    const checkAccess = async () => {
        console.log("hasAccess:",hasAccess);
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaBoard.abi, signer);
            const hasAccess = await connectedContract.hasAccess();
            console.log("hasAccess:",hasAccess);
            setHasAccess(hasAccess);
        } else {
            <Alert>
                Make sure you have metamask!
            </Alert>
        }
    }
    return (
        <div className='homeDiv'>
            <button onClick={() => navigate('addIdea')}className='cta-button connect-wallet-button'>
                Add an idea
            </button>
            {ideaList.map((idea, index) => {
                return(
                    <Card style={{ width: '70%', border: '1px solid grey', borderRadius: '30px', margin: '20px' }}>
                        <Card.Body>
                        <Card.Title>{idea[3]}</Card.Title>
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