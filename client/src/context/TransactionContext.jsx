// will be using react context API

import React, {useState,useEffect} from "react";
import {ethers} from 'ethers';

import { contractABI, contractAddress} from '../utils/constants';


// Usecontext hook
export const TransactionContext = React.createContext();

// destructuring ethereum object from window
const {ethereum} = window; 

const getEthereumContract =() =>
{
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer= provider.getSigner();
    // below are the ingredients that we need to fetch our contract.
   
   
    const TransactionContract= new ethers.Contract(contractAddress, contractABI, signer); 

    return TransactionContract;
    // console.log({
    //     provider,
    //     signer,
    //     TransactionContract
    // })
}

export const TransactionProvider= ({children}) => {

    const [CurrentAccount,  setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo: "", amount: "", keyword: "", message:""});
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'));


//   IMPORTANT
    const handleChange= (e,name)=> {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }



    const checkIfWalletIsConnected= async () => {
        try{
        if(!ethereum) return alert("Please install metamask");

        const accounts = await ethereum.request({ method: "eth_accounts"});

        if(accounts.length){
            setCurrentAccount(accounts[0]);

            // getAllTransactions();
        } else{
            console.log('No Accounts Found');
        }
    }
    catch(error) {
        console.log(error);
        // throw new Error('No Ethereum object.')
    }
        // console.log(accounts);
    }

   

    const connectWallet = async () =>
    {
        try{
            if(!ethereum) return alert("please install metamask");
        const accounts = await ethereum.request({ method: 'eth_requestAccounts',});

        setCurrentAccount(accounts[0]);
        // window.location.reload();

        }
        catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    const sendTransaction = async () => {

            try{
                if(!ethereum) return alert("please install metamask");

                const { addressTo, amount, keyword, message}= formData;
               const TransactionContract=  getEthereumContract(); 
               const parsedAmount= ethers.utils.parseEther(amount);


            //    TransactionContract use this function to call all the CONTRACT related function.

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: CurrentAccount,
                    to: addressTo,
                    gas: '0x5200', // 21000 GWEI IN HEXADECIMAL FORM;
                    value: parsedAmount._hex, //ether form
                }]
            });
            //storing transaction in the blockchain.

            //this is an asynchronous action.thats why we have add here a loading state
           const transactionHash= await TransactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

           setisLoading(true);
           console.log(`Loading - ${transactionHash.hash}`);
           await transactionHash.wait();
           setisLoading(false);
           console.log(`Success - ${transactionHash.hash}`);

           const transactionCount= await TransactionContract.getTransactionCount();
           settransactionCount(transactionCount.toNumber());
           
        } catch (error) {
            console.log(error);
            throw new Error( "No Ethereum object." );
        }
    }
        
    

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);




    return (
        <TransactionContext.Provider value={{ connectWallet, CurrentAccount, formData, setFormData, handleChange, sendTransaction }}> 
            {children }
        </TransactionContext.Provider>
    )
    }