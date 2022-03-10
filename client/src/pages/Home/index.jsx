import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../Socket";
import Web3 from "web3";

import "./Home.css";

export function Home() {

  const [inMatchmaking, setInMatchmaking] = React.useState(false);
  const [pseudo, setPseudo] = React.useState(" ");
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [supply, setSupply] = useState(); 

  const navigate = useNavigate();

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();

    const currentProvider = detectCurrentProvider();
    if(currentProvider) {
      const web3js = new Web3(currentProvider);
        const contract = new web3js.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        async function getSupplyFunction() {
          contract.methods.getSupply().call().then((res) => {
            setSupply(res)
          })
        }
  
        getSupplyFunction();
    }

  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      toastError({
        title: 'Non-Ethereum browser detected. You should consider trying MetaMask!',
        description: '',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log('Non ethereum browser detected')
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if(chainId !== 43113) return alert("you must connect to avalanche ");
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
          console.log("please connect to metamask")
        }
      }
    } catch (err) {
      console.log("There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.")
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  socket.on('isInGame', (obj) => {
    if(obj.is == true) {
      navigate(`game-${obj.id}`)
    }
  })

  function joinMatchmaking() {
    setInMatchmaking(true)

    socket.emit("addPlayer", {username: pseudo})
  }

  function leaveMatchmaking() {
    setInMatchmaking(false);

    socket.emit("removePlayer", {id: socket.id})
  }

  const handleChange = (e) => {
    setPseudo(e.target.value);
  }

  return (
    <div className="home-container">
        <input onChange={handleChange} />
        <button onClick={joinMatchmaking} className="enter-room-button">Play</button>
        {
          inMatchmaking &&
          <>
            <h1>Searching player ...</h1>
            <button onClick={leaveMatchmaking}>Leave matchmaking</button>
          </>
        }
    </div>
  );
};
