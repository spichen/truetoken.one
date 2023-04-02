pragma solidity ^0.8.2;  //Do not change the solidity version as it negativly impacts submission grading

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrueToken is ERC1155, Ownable {
  uint256 private _currentBrandID = 0;
  uint256 private _currentTokenID = 0;
  event BrandRegistered(address indexed brandAddress, uint256 indexed brandId);
  mapping(uint256 => address) private _brandIdAddressMapping;
  mapping(uint256 => uint256) private _tokenBrandMapping;
  mapping(address => mapping (uint256 => uint256)) private _accountTokenMapping;
  mapping(uint256 => string[]) private _tokenLogMapping;

  constructor(string memory _uri) ERC1155(_uri) {}

  function registerBrand(address brandAddress) public {
      uint256 brandID = _getNextBrandID();
      _brandIdAddressMapping[brandID] = brandAddress;
      _incrementBrandId();
      emit BrandRegistered(brandAddress, brandID);
  }

  function mint(address customerAddress, uint256 brandId, string memory uri) public {
      require(msg.sender == _brandIdAddressMapping[brandId], "Only brand owner can mint token");

      uint256 tokenId = _getNextTokenID();
      _accountTokenMapping[customerAddress][brandId] = tokenId;
      _tokenLogMapping[tokenId].push(uri);
      _tokenBrandMapping[tokenId] = brandId;
      _mint(customerAddress, brandId, 1, bytes(uri));
  }

  function addLog(uint256 tokenId, string memory uri) public {
      require(msg.sender == _brandIdAddressMapping[_tokenBrandMapping[tokenId]], "Only token issued brand can add log");

      _tokenLogMapping[tokenId].push(uri);
  }
  
  function addressOf(uint256 brandId) public view virtual returns (address) {
      return _brandIdAddressMapping[brandId];
  }
  
  function tokenOf(address account, uint256 brandId) public view virtual returns (uint256) {
      return _accountTokenMapping[account][brandId];
  }

  function logsOf(uint256 tokenId) public view virtual returns (string[] memory) {
      return _tokenLogMapping[tokenId];
  }

  function brandIdOf(uint256 tokenId) public view virtual returns (uint256) {
      return _tokenBrandMapping[tokenId];
  }

    function _getNextBrandID() private view returns (uint256) {
        return _currentBrandID + 1;
    }

	function _incrementBrandId() private {
        _currentBrandID++;
	}

    function _getNextTokenID() private view returns (uint256) {
        return _currentTokenID + 1;
    }

	function _incrementTokenId() private {
        _currentTokenID++;
	}
}