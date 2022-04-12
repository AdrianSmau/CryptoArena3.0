// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FighterFactory.sol";
import "./Merchant.sol";

abstract contract FighterEvolution is FighterFactory, Merchant {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint256 randNonce = 0;

    modifier onlyOwnerOf(uint256 _fighterId) {
        require(
            _msgSender() == fighter_to_owner[_fighterId],
            "You are not the owner of this Fighter!"
        );
        _;
    }

    modifier hasAvailablePupils() {
        require(
            user_available_pupils[_msgSender()] >= uint16(1),
            "You do not have any available pupils! Fight to earn more!"
        );
        _;
    }

    function fetchAvailablePupils(address _owner)
        external
        view
        returns (uint16)
    {
        return user_available_pupils[_owner];
    }

    function redeemAvailablePupil(string calldata _name, FighterClass _class)
        external
        hasAvailablePupils
    {
        _createFighter(_name, _class);
    }

    function _spendAvailablePoints(
        uint256 _fighterId,
        uint16 _STR,
        uint16 _AGL,
        uint16 _LCK,
        uint16 _DEX
    ) external onlyOwnerOf(_fighterId) {
        Fighter storage _myFighter = fighters[_fighterId];
        uint16 total = _STR;
        total = total.add(_AGL);
        total = total.add(_LCK);
        total = total.add(_DEX);
        require(
            total <= _myFighter.spendablePoints,
            "You do not have enough available spendable points in order to do this action!"
        );
        _myFighter.spendablePoints = _myFighter.spendablePoints.sub(total);
        _myFighter.strength = _myFighter.strength.add(_STR);
        _myFighter.agility = _myFighter.agility.add(_AGL);
        _myFighter.dexterity = _myFighter.dexterity.add(_DEX);
        _myFighter.luck = _myFighter.luck.add(_LCK);
    }

    function _fighterWonFight(uint256 _fighterId) internal {
        Fighter storage fighter = fighters[_fighterId];
        fighter.winCount = fighter.winCount.add(1);
        fighter.currentXP = fighter.currentXP.add(40);
        if (fighter.currentXP >= fighter.levelUpXP) {
            _levelUpLogic(fighter, _fighterId);
        }
    }

    function _fighterLostFight(uint256 _fighterId) internal {
        Fighter storage fighter = fighters[_fighterId];
        fighter.lossCount = fighter.lossCount.add(1);
        fighter.currentXP = fighter.currentXP.add(25);
        if (fighter.currentXP >= fighter.levelUpXP) {
            _levelUpLogic(fighter, _fighterId);
        }
    }

    function _levelUpLogic(Fighter storage fighter, uint256 _fighterId)
        private
    {
        fighter.levelUpXP = fighter.levelUpXP.add(100);
        fighter.level = fighter.level.add(1);
        fighter.HP = fighter.HP.add(10);
        fighter.spendablePoints = fighter.spendablePoints.add(1);
        if (fighter.level.mod(10) == 0) {
            address _fighter_owner = fighter_to_owner[_fighterId];
            user_available_pupils[_fighter_owner] = user_available_pupils[
                _fighter_owner
            ].add(1);
            if (_computeWeaponDropChance(_fighter_owner)) {
                _forgeWeapon(
                    _fighter_owner,
                    fighter.level,
                    _simulateWeaponType(_fighter_owner),
                    WeaponTier.B
                );
            }
        }
    }

    function _getWeaponByFighterId(uint256 id)
        external
        view
        returns (WeaponDTO[] memory)
    {
        return (_getUserWeapons(fighter_to_owner[id]));
    }

    // Not secure - but in the circumstances is worth the compromise!
    // --------- RANDOMNESS SIMULATION FUNCTIONS --------------------
    function _computeWeaponDropChance(address _owner) private returns (bool) {
        randNonce = randNonce.add(1);
        uint256 generatedNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, _owner, randNonce))
        ).mod(100);
        if (generatedNumber <= 40) {
            return true;
        }
        return false;
    }

    function _simulateWeaponType(address _owner) private returns (WeaponType) {
        randNonce = randNonce.add(1);
        uint256 generatedNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, _owner, randNonce))
        ).mod(100);
        if (generatedNumber <= 50) {
            return WeaponType.Slash;
        }
        return WeaponType.Blunt;
    }

    function _computeCriticalStrikeOrDodgeChance(address _owner, uint16 skill)
        internal
        returns (bool)
    {
        uint256 chance = uint256(skill) + 5;
        randNonce = randNonce.add(1);
        uint256 generatedNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, _owner, randNonce))
        ).mod(100);
        if (generatedNumber <= chance) {
            return true;
        }
        return false;
    }

    function _triggerCooldown(Fighter storage _myFighter) internal {
        _myFighter.readyTime = uint32(block.timestamp + cooldownTime);
    }
}
