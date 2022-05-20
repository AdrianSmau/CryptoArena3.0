// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FighterFactory.sol";

abstract contract MarketGift is FighterFactory {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint16 public immutable feePercent = 5;
    address private nftHolderAccount =
        0x2b6A10C78C6374D4b43d2fC2295023B745533951;

    //event UpForSale(address indexed seller, uint256 fighterId, uint256 price);
    /*event Sold(
        address indexed buyer,
        address indexed seller,
        uint256 fighterId,
        uint256 price
    );*/
    event Gift(
        address indexed sender,
        address indexed receiver,
        uint256 fighterId
    );

    mapping(uint256 => uint256) internal fighter_to_price;
    mapping(uint256 => address) internal fighter_to_seller;

    modifier hasValidPrice(uint256 price) {
        require(price > 0);
        _;
    }

    modifier hasEnoughFighters(uint256 _fighterId) {
        require(
            owner_fighters_count[fighter_to_owner[_fighterId]] >= 1, //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            "You cannot sell or gift your only character!"
        );
        _;
    }

    function putUpForSale(uint256 _myFighterId, uint256 price)
        external
        onlyOwnerOf(_myFighterId)
        hasEnoughFighters(_myFighterId)
        hasValidPrice(price)
        notForSale(_myFighterId)
    {
        //price = price * (1 ether);
        _transfer(_msgSender(), nftHolderAccount, _myFighterId);
        fighter_to_price[_myFighterId] = computeTotalPrice(price);
        fighter_to_seller[_myFighterId] = _msgSender();
        fighters[_myFighterId].isForSale = true;
        //emit UpForSale(_msgSender(), _myFighterId, computeTotalPrice(price));
    }

    modifier fighterPrice(uint256 fighterId) {
        require(
            msg.value >= computeFeelessPrice(fighter_to_price[fighterId]),
            "You sent insufficient ETH for Fighter!"
        );
        _;
    }

    function buyFighter(uint256 _fighterId)
        external
        payable
        forSale(_fighterId)
        fighterPrice(_fighterId)
    {
        uint256 price = computeFeelessPrice(fighter_to_price[_fighterId]);
        uint256 excess = msg.value - price;
        if (excess > 0) {
            payable(_msgSender()).transfer(excess);
        }
        fighters[_fighterId].isForSale = false;
        _approve(_msgSender(), _fighterId);
        _transfer(nftHolderAccount, _msgSender(), _fighterId);
        payable(fighter_to_seller[_fighterId]).transfer(price);
        /*emit Sold(
            _msgSender(),
            fighter_to_seller[_fighterId],
            _fighterId,
            fighter_to_price[_fighterId]
        );*/

        fighter_to_price[_fighterId] = 0;
        fighter_to_seller[_fighterId] = address(0);
    }

    function giftFighter(address receiver, uint256 _myFighterId)
        external
        onlyOwnerOf(_myFighterId)
        hasEnoughFighters(_myFighterId)
        notForSale(_myFighterId)
    {
        require(receiver != address(0), "Cannot gift NFT to the zero address");
        _transfer(_msgSender(), receiver, _myFighterId);
        emit Gift(_msgSender(), receiver, _myFighterId);
    }

    function getFighterPrice(uint256 fighterId)
        external
        view
        forSale(fighterId)
        returns (uint256)
    {
        return fighter_to_price[fighterId];
    }

    function getFighterSeller(uint256 fighterId)
        external
        view
        forSale(fighterId)
        returns (address)
    {
        return fighter_to_seller[fighterId];
    }

    function computeTotalPrice(uint256 initialPrice)
        private
        pure
        returns (uint256)
    {
        return (initialPrice + ((initialPrice * uint256(feePercent)) / 100));
    }

    function computeFeelessPrice(uint256 totalPrice)
        private
        pure
        returns (uint256)
    {
        return ((20 * totalPrice) / 21);
    }

    function changeNFTHolderAccount(address newAddr) external onlyOwner {
        require(
            newAddr != address(0),
            "Cannot set NFT holder address to the zero address"
        );
        nftHolderAccount = newAddr;
    }
}
