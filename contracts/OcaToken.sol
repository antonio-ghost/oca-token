// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OcaToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    uint256 public constant TAX_DENOMINATOR = 10_000;
    uint256 public constant BURN_TAX = 50; // 0.5%
    uint256 public constant TREASURY_TAX = 50; // 0.5%
    uint256 public constant TOTAL_TAX = BURN_TAX + TREASURY_TAX; // 1%

    address public treasuryWallet;
    address public pancakePair;

    mapping(address => bool) public isExcludedFromTax;

    event TreasuryWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event PancakePairUpdated(address indexed oldPair, address indexed newPair);
    event ExcludedFromTaxUpdated(address indexed account, bool excluded);

    constructor(address _treasuryWallet)
        ERC20("OCA Token", "OCA")
        Ownable(msg.sender)
    {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");

        treasuryWallet = _treasuryWallet;

        isExcludedFromTax[msg.sender] = true;
        isExcludedFromTax[_treasuryWallet] = true;
        isExcludedFromTax[address(this)] = true;

        _mint(msg.sender, MAX_SUPPLY);
    }

    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");

        address oldWallet = treasuryWallet;
        treasuryWallet = _treasuryWallet;

        isExcludedFromTax[_treasuryWallet] = true;

        emit TreasuryWalletUpdated(oldWallet, _treasuryWallet);
    }

    function setPancakePair(address _pancakePair) external onlyOwner {
        require(_pancakePair != address(0), "Invalid pair address");

        address oldPair = pancakePair;
        pancakePair = _pancakePair;

        emit PancakePairUpdated(oldPair, _pancakePair);
    }

    function setExcludedFromTax(address account, bool excluded) external onlyOwner {
        require(account != address(0), "Invalid account");

        isExcludedFromTax[account] = excluded;

        emit ExcludedFromTaxUpdated(account, excluded);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (
            value == 0 ||
            from == address(0) ||
            to == address(0) ||
            pancakePair == address(0) ||
            isExcludedFromTax[from] ||
            isExcludedFromTax[to]
        ) {
            super._update(from, to, value);
            return;
        }

        bool isBuy = from == pancakePair;
        bool isSell = to == pancakePair;

        if (!isBuy && !isSell) {
            super._update(from, to, value);
            return;
        }

        uint256 burnAmount = (value * BURN_TAX) / TAX_DENOMINATOR;
        uint256 treasuryAmount = (value * TREASURY_TAX) / TAX_DENOMINATOR;
        uint256 amountAfterTax = value - burnAmount - treasuryAmount;

        if (burnAmount > 0) {
            super._update(from, address(0), burnAmount);
        }

        if (treasuryAmount > 0) {
            super._update(from, treasuryWallet, treasuryAmount);
        }

        super._update(from, to, amountAfterTax);
    }
}