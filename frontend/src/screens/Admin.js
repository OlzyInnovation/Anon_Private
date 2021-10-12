import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import { anon_contract_address } from '../config';
import anon from '../artifacts/AnonDapp.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Admin = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    description: '',
  });

  async function onChange(e) {
    const file = e.target.files[0];
    /* first, upload to IPFS */
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);

      console.log('Image Upload URL: ', url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  async function createMarket() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(anon_contract_address, anon.abi, signer);

    const { name, description } = formInput;
    if (!name || !description || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(url);
      let saveUrl = await contract.addIdToURL(url);
      let tx = saveUrl.wait();
      console.log(tx);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && (
          <img className="rounded mt-4" width="350" src={fileUrl} alt="" />
        )}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Upload NFT
        </button>
      </div>
    </div>
  );
};

export default Admin;
