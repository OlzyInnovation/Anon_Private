// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract AnonDapp is Ownable, ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Counters.Counter private _tokenURLs;
  Counters.Counter public _minted;
  Counters.Counter public _sold;
    

  uint256 public maxSupply;
  uint256 public cost;
  uint256 public maxMintPerWalletAddress;
  bool public paused;
  bool public presale;
  string public baseExtension;
  string public baseURI;
  
  constructor(string memory _name, string memory _symbol, string memory _initialBaseURI) ERC721(_name, _symbol) {
      setBaseURI(_initialBaseURI);
  }
  
  mapping(address => uint256) public addressToMintBalance;
  mapping (address => bool) userAddr;  
  mapping (uint256 => string) tokenIdToUrl;


  function getCost() public view returns (uint256) {
      return cost ** 18;
  }
  function setCost(uint256 _cost) public onlyOwner {
      cost = _cost / 10;
  }
  
  function setMaxSupply(uint256 _maxSupply) public onlyOwner {
      maxSupply = _maxSupply;
  }
  
  function getMaxSupply() public view returns (uint256) {
      return maxSupply;
  }
  
  function togglePaused() public onlyOwner returns (bool) {
      paused = !paused;
      return true;
  }
  
  function getStatus() public view returns (bool) {
      return paused;
  }

  function togglePresale() public onlyOwner returns (bool) {
      presale = !presale;
      return true;
  }
  function getPresale() public view returns (bool) {
      return presale;
  }
  
  function setBaseExtension(string memory _baseExtension) public onlyOwner {
      baseExtension = _baseExtension;
  }
  
  function getBaseURI() public view returns (string memory) {
    return baseURI;
  }
  
   function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }
  
   function withdraw() public payable onlyOwner {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
  
  function setMaxMintPerWalletAddress(uint256 _maxMintPerWalletAddress) public onlyOwner {
      maxMintPerWalletAddress = _maxMintPerWalletAddress;
  }

  function getTokenURI(uint256 tokenId) public view returns (string memory) {
    string memory base = _baseURI();
    string memory url = tokenIdToUrl[tokenId];
    return bytes(base).length > 0
        ? string(abi.encodePacked(base, url))
        : "";
  }



  function mint(uint256 _amount) public payable {
    require(!paused, "Contract is currently paused");
    require(_amount > 0, "Inavalid Input, Must mint at least 1 NFT");
    require(_amount <= maxMintPerWalletAddress, "maxMintPerWalletAddress Exceeded");
    require(addressToMintBalance[msg.sender] + _amount < maxSupply, "All NFTs are Minted");
    require(addressToMintBalance[msg.sender] + _amount <= maxMintPerWalletAddress, "All NFTs are Minted");
    require(_tokenIds.current() < maxSupply, "All NFTs are Minted");
    
    if(presale){
      if (msg.sender != owner()) {
        require(userAddr[msg.sender] == true, "Address not whitelisted");
        require(msg.value >= cost * _amount, "Cannot Complete, Insufficient Funds");
        for (uint i = 0; i < _amount; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            require(newItemId <= _minted.current(), "No NFTS currently available");
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenIdToUrl[newItemId]);
            setApprovalForAll(msg.sender, true);
            addressToMintBalance[msg.sender] ++;
            _sold.increment();
            _minted.increment();
        }
    }else if(msg.sender == owner()){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenIdToUrl[newItemId]);
        setApprovalForAll(msg.sender, true);
        addressToMintBalance[msg.sender] ++;
        _sold.increment();
    }
     
    }else {
      if (msg.sender != owner()) {
        require(msg.value >= cost * _amount, "Cannot Complete, Insufficient Funds");
        for (uint i = 0; i < _amount; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenIdToUrl[newItemId]);
        setApprovalForAll(msg.sender, true);
        addressToMintBalance[msg.sender] ++;
        _sold.increment();
            
        }
    }else if(msg.sender == owner()){
         _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenIdToUrl[newItemId]);
        setApprovalForAll(msg.sender, true);
        addressToMintBalance[msg.sender] ++;
        _sold.increment();
        }
    }
   
  }

  function whitelistAddress (address[] memory users) public onlyOwner {
        for (uint i = 0; i < users.length; i++) {
            userAddr[users[i]] = true;
        }
  }

  function whitelisted() public view returns (string memory) {
    if (msg.sender == owner()) {
      return 'Owner is always whitelisted';
    }

    require(userAddr[msg.sender] == true, 'You are not whitelisted!');

    return 'You are whitelisted';
  }

  function addIdToURL(string memory _url) public onlyOwner {
    _tokenURLs.increment();
    uint256 newUrl = _tokenURLs.current();
    require(newUrl <= maxSupply, "Maximum amount of Tokens Minted");
    tokenIdToUrl[newUrl] = _url;
    _minted.increment();
  }

  function getAmountMinted() public view returns (uint256) {
    return _minted.current();
  }
  
  function getAmountSold() public view returns (uint256) {
    return _sold.current();
  }
}
