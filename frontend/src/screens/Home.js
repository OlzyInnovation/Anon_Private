import React, { useState } from 'react';
import { ethers } from 'ethers';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
// import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

import { anon_contract_address } from '../config';
import anon from '../artifacts/AnonDapp.json';

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Home = () => {
  const [amount, setAmount] = useState(0);
  const [uri, setUri] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  async function check_uri() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);
    let transaction = await contract.getTokenURI(uri);
    let tx = await transaction.wait();
    console.log(tx);
  }

  async function createSale(_amount) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);
    let transaction = await contract.mint(_amount);
    console.log(transaction);
    let tx = await transaction.wait();

    console.log(tx);
  }

  async function withdraw() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);

    let withdraw = await contract.withdraw();
    let tx = await withdraw.wait();
    console.log(tx);
  }
  async function set_max_supply() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);

    let set_max_supply = await contract.setMaxSupply(maxSupply);
    let tx = await set_max_supply.wait();
    console.log(tx);
  }
  async function toggle_paused() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);

    let toggle = await contract.togglePaused();
    let tx = await toggle.wait();
    console.log(tx);
  }
  async function toggle_presale() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);

    let toggle = await contract.togglePresale();
    let tx = await toggle.wait();
    console.log(tx);
  }

  return (
    <div className="flex justify-center">
      <h1>Hello</h1>
      <div className="w-1/2 flex flex-col pb-12">
        <div>
          <input
            type="number"
            placeholder="Number of NFTs to purchase"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              createSale(amount);
            }}
          >
            Buy
          </button>
        </div>

        <div>
          <input
            type="number"
            placeholder="Enter tokenId"
            onChange={(e) => setUri(e.target.value)}
          />
          <button type="submit" onClick={check_uri}>
            Confirm
          </button>
        </div>

        <div>
          <input
            type="number"
            placeholder="Enter MaxSupply"
            onChange={(e) => setMaxSupply(e.target.value)}
          />

          <button type="submit" onClick={() => set_max_supply}>
            Set Max Supply
          </button>
        </div>
        <div>
          <button type="submit" onClick={() => toggle_paused}>
            Pause
          </button>
        </div>
        <div>
          <button type="submit" onClick={() => toggle_presale}>
            Toggle Presale
          </button>
        </div>
        <div>
          <button type="submit" onClick={() => withdraw}>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
