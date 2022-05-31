import React, {useState, useEffect} from 'react';
import './App.css';
import NFTContract from './utils/NFTContract';
import { ethers } from "ethers";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Home from './components/Home/Home';
import AddIdea from './components/AddIdea/AddIdea';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {alertService} from './components/Alert/alert.service';
import AlertComp from './components/Alert/AlertComp';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Spinner from 'react-bootstrap/Spinner'


//TODO - Prevent app from using non desired networks 
//TODO- referesh page automatically once nft is detected
// TODO - refresh page once vote tx is completeds - DONE
// TODO - add character limit on title and description - DONE
function App() {

  const navigate = useNavigate();

  

  const [currentAccount, setCurrentAccount] = useState("");
  const [eth, setEth] = useState(null);
  const [network, setNetwork] = useState("")

  useEffect(() => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.on("network", (newNetwork, oldNetwork) => {
        
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          setNetwork(newNetwork.chainId?.toString());
          if (oldNetwork) {
              window.location.reload();
          }
      });
    }catch(err){
      console.log(err);
      alertService.error("Make sure you have metamask!")
    }
    checkIfWalletIsConnected()
  }, [eth])
  
  const LoadingIndicator = props => {
    console.log("loader called");
    const { promiseInProgress } = usePromiseTracker();
     return (
        promiseInProgress && 
        <div
          style={{
            width: "100%",
            height: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px"
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );  
   }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    setEth(ethereum);
    if (!ethereum) {
      console.log("No ethereum found");
      alertService.error("Make sure you have metamask!");
    } else {
      
      console.log("We have the ethereum object", ethereum);
      if(eth && eth?.chainId &&  eth?.chainId!== "0x4"){
        alertService.error("Make sure you are on the Rinkbey Network to interact");
      }
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      // <Alert>
      //   No Authorized accounts found!
      // </Alert>;
    }
  }

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xA6Fa50c9817D47ec2608c0159C9cE666b95260Fd";
  
    try {
      const { ethereum } = window;
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, NFTContract.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await trackPromise(connectedContract.makeNFT());
  
        console.log("Mining...please wait.")
        await trackPromise(nftTxn.wait());
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      if (!eth) {
        alertService.error("Make sure you have metamask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await eth.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  
  const handleAccountChange = (...args) => {
    // you can console to see the args
    const accounts = args[0] ;
    // if no accounts that means we are not connected
    if (accounts.length === 0) {
      alertService.error("Please connect to your wallet!");
      // our old data is not current connected account
      // currentAccount account that you already fetched and assume you stored it in useState
    } else if (accounts[0] !== currentAccount) {
      // if account changed you should update the currentAccount so you return the updated the data
      // assuming you have [currentAccount,setCurrentAccount]=useState
      // however you are tracking the state currentAccount, you have to update it. in case of redux you have to dispatch update action etc
      setCurrentAccount(accounts[0]);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    eth?.on("accountsChanged", handleAccountChange);
    return () => {
      eth?.removeListener("accountsChanged", handleAccountChange);
    };
  }, [])

  return (
    <div className="App">

      <Navbar>
        <Container>
          
          <Navbar.Brand onClick={() => navigate("/")}><h1>Idea Board</h1></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                {(currentAccount !== "") && (
                  <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                    Mint NFT
                  </button>
                )}
                {currentAccount === "" && 
                  renderNotConnectedContainer()
                }
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoadingIndicator />
      {currentAccount !== "" && 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addIdea" element={<AddIdea />} />
      </Routes>
      }
      <AlertComp />
    </div>
  );
}

export default App;
