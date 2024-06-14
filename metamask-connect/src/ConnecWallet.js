// src/ConnectWallet.js

import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectWallet = () => {
    const [account, setAccount] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [signature, setSignature] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                setWeb3(web3Instance);
            } catch (error) {
                console.error("User denied account access");
            }
        } else {
            console.error("MetaMask is not installed");
        }
    };

    const signMessage = async () => {
        if (web3 && account) {
            const message = `I am signing this message to prove I own the account: ${account}`;
            try {
                const signature = await web3.eth.personal.sign(message, account, '');
                setSignature(signature);
                console.log("Signature:", signature);
            } catch (error) {
                console.error("Error signing message:", error);
            }
        }
    };

    const verifySignature = async () => {
        if (web3 && account && signature) {
            const message = `I am signing this message to prove I own the account: ${account}`;
            try {
                const signer = await web3.eth.personal.ecRecover(message, signature);
                console.log("Signer:", signer);
                if (signer.toLowerCase() === account.toLowerCase()) {
                    alert("Signature verified successfully!");
                } else {
                    alert("Signature verification failed!");
                }
            } catch (error) {
                console.error("Error verifying signature:", error);
            }
        }
    };

    return (
        <div>
            <h1>MetaMask Connect</h1>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : "Connect MetaMask"}
            </button>
            {account && <button onClick={signMessage}>Sign Message</button>}
            {signature && (
                <>
                    <p>Signature: {signature}</p>
                    <button onClick={verifySignature}>Verify Signature</button>
                </>
            )}
        </div>
    );
};

export default ConnectWallet;
