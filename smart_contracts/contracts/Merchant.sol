// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./WeaponFactory.sol";

abstract contract Merchant is WeaponFactory {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint256 feePerLevel = 0.00075 ether;
    uint256 BTierPrice = 0.0005 ether;
    uint256 ATierPrice = 0.0015 ether;
    uint256 STierPrice = 0.003 ether;

    modifier weaponPrice(uint256 price) {
        require(
            msg.value >= price,
            "You sent insufficient ETH for forging this weapon!"
        );
        _;
    }

    function _purchaseWeapon(
        uint32 _level,
        WeaponType _type,
        WeaponTier _tier
    ) external payable weaponPrice(_computeWeaponPrice(_level, _tier)) {
        uint256 price = _computeWeaponPrice(_level, _tier);
        uint256 excess = msg.value - price;
        if (excess > 0) {
            payable(_msgSender()).transfer(excess);
        }
        _forgeWeapon(_msgSender(), _level, _type, _tier);
    }

    function _computeWeaponPrice(uint32 _level, WeaponTier _tier)
        public
        view
        returns (uint256)
    {
        uint256 basePrice = feePerLevel.mul(uint256(_level));
        if (_tier == WeaponTier.B) return basePrice.add(BTierPrice);
        if (_tier == WeaponTier.S) return basePrice.add(STierPrice);
        return basePrice.add(ATierPrice);
    }

    /*function setFeePerLevel(uint256 _fee) external onlyOwner {
        feePerLevel = _fee;
    }

    function setBTierPrice(uint256 _fee) external onlyOwner {
        BTierPrice = _fee;
    }

    function setATierPrice(uint256 _fee) external onlyOwner {
        ATierPrice = _fee;
    }

    function setSTierPrice(uint256 _fee) external onlyOwner {
        STierPrice = _fee;
    }*/

    function _collectMerchantBalance() external onlyOwner {
        payable(_msgSender()).transfer(address(this).balance);
    }

    receive() external payable {}
}
