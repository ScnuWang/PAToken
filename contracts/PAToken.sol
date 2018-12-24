pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract PAToken is ERC20 {

    string public name = "PAToken";
    string public symbol = "PAT";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 21000;

    constructor() public {
      _mint(msg.sender, INITIAL_SUPPLY);
    }
}
