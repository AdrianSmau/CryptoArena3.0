// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FighterFactory.sol";
import "./WeaponFactory.sol";
import "./openzeppelin/SafeMath.sol";

contract FighterEvolution is FighterFactory, WeaponFactory {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint256 randNonce = 0;

    function _fighterWonFight(uint256 _fighterId) internal returns (bool) {
        Fighter storage fighter = fighters[_fighterId];
        fighter.winCount.add(1);
        fighter.currentXP.add(45);
        if (fighter.currentXP >= fighter.levelUpXP) {
            return _levelUpLogic(fighter, _fighterId);
        }
        return false;
    }

    function _fighterLostFight(uint256 _fighterId) internal returns (bool) {
        Fighter storage fighter = fighters[_fighterId];
        fighter.lossCount.add(1);
        fighter.currentXP.add(20);
        if (fighter.currentXP >= fighter.levelUpXP) {
            return _levelUpLogic(fighter, _fighterId);
        }
        return false;
    }

    function _levelUpLogic(Fighter storage fighter, uint256 _fighterId)
        private
        returns (bool)
    {
        fighter.levelUpXP.add(100);
        fighter.level.add(1);
        fighter.HP.add(20);
        if (fighter.level.mod(10) == 0) {
            address _fighter_owner = fighter_to_owner[_fighterId];
            user_available_pupils[_fighter_owner] = user_available_pupils[
                _fighter_owner
            ].add(1);
            fighter.spendablePoints.add(1);
            if (_computeWeaponDropChance(_fighter_owner)) {
                _forgeWeapon(
                    _fighter_owner,
                    fighter.level,
                    _simulateWeaponType(_fighter_owner),
                    WeaponTier.B
                );
                return true;
            }
        }
        return false;
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

    function _computeCriticalStrikeChance(address _owner, uint16 lck)
        internal
        returns (bool)
    {
        uint256 chance = uint256(lck) + 5;
        randNonce = randNonce.add(1);
        uint256 generatedNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, _owner, randNonce))
        ).mod(100);
        if (generatedNumber <= chance) {
            return true;
        }
        return false;
    }

    function _computeDodgeChance(address _owner, uint16 dex)
        internal
        returns (bool)
    {
        uint256 chance = uint256(dex) + 5;
        randNonce = randNonce.add(1);
        uint256 generatedNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, _owner, randNonce))
        ).mod(100);
        if (generatedNumber <= chance) {
            return true;
        }
        return false;
    }
}
