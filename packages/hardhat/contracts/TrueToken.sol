pragma solidity ^0.8.2; //Do not change the solidity version as it negativly impacts submission grading

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract TrueToken is ERC1155 {
  struct Token {
    uint256 id;
    address owner;
    string metadataCID;
    string[] logCIDs;
  }

  struct Business {
    uint256 id;
    address owner;
    string name;
  }

  uint256 constant BRAND_MASK = uint256(type(uint128).max) << 128;
  uint256 constant TOKEN_INDEX_MASK = type(uint128).max;
  uint256 private _businessIDNonce = 0;
  uint256 private _tokenIndexNonce = 0;
  mapping(address => uint256) private _addressBusinessIdMapping;
  mapping(uint256 => Token) private _tokens;
  mapping(uint256 => Token[]) private _businessTokens;
  mapping(address => Token[]) private _ownerTokens;
  mapping(uint256 => Business) private _businessMapping;

  event BusinessRegistered(address indexed businessAddress, uint256 indexed businessId);
  event TokenMint(address indexed walletAddress, uint256 indexed tokenId);

  constructor(string memory _uri) ERC1155(_uri) {}

  function registerBusiness(address businessAddress, string memory name) public {
    require(_addressBusinessIdMapping[businessAddress] == 0, "business already registered");
    uint256 businessID = ++_businessIDNonce << 128;
    _addressBusinessIdMapping[businessAddress] = businessID;

    Business memory business = Business(businessID, businessAddress, name);
    _businessMapping[businessID] = business;
    emit BusinessRegistered(businessAddress, businessID);
  }

  function mint(address customerAddress, string memory cid) public {
    require(_addressBusinessIdMapping[msg.sender] > 0, "Only registered business can mint token");
    uint256 businessId = _addressBusinessIdMapping[msg.sender];
    uint256 tokenIndex = ++_tokenIndexNonce;

    uint256 tokenId = businessId + tokenIndex;

    Token memory token = Token(tokenId, customerAddress, cid, new string[](0));

    _tokens[tokenId] = token;
    _businessTokens[businessId].push(token);
    _ownerTokens[customerAddress].push(token);

    _mint(customerAddress, businessId, 1, "");
    _mint(customerAddress, tokenId, 1, bytes(cid));
  }

  function addLog(uint256 tokenId, string memory uri) public {
    require(businessIdOf(msg.sender) == businessIdOf(tokenId), "Only token owner can add log");
    _tokens[tokenId].logCIDs.push(uri);
  }

  function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes memory _data) public virtual override {
    super.safeTransferFrom(_from, _to, _id, _value, _data);
    _tokens[_id].owner = _to;
    _ownerTokens[_to].push(_tokens[_id]);
    _ownerTokens[_from].pop();
  }

  function businessIdOf(uint256 tokenId) public view virtual returns (uint256) {
    return tokenId & BRAND_MASK;
  }

  function businessIdOf(address account) public view virtual returns (uint256) {
    return _addressBusinessIdMapping[account];
  }

  function business(uint256 businessId) public view virtual returns (Business memory) {
    return _businessMapping[businessId];
  }

  function logsOf(uint256 tokenId) public view virtual returns (string[] memory) {
    return _tokens[tokenId].logCIDs;
  }

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return _tokens[tokenId].metadataCID;
  }

  function tokenIssuedBy(uint256 businessId) public view virtual returns (Token[] memory) {
    return _businessTokens[businessId];
  }

  function tokenOwnedBy(address account) public view virtual returns (Token[] memory) {
    return _ownerTokens[account];
  }
}

// first businessId: 340282366920938463463374607431768211456
// firs tokenId: 340282366920938463463374607431768211457
