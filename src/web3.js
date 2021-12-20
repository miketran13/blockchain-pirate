import Web3 from 'web3';
//window as any;
if(window.ethereum)

window.ethereum.enable();

const web3 = new Web3(window.web3.currentProvider);

export default web3;