// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FighterEvolution.sol";

contract Arena is FighterEvolution {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event ArenaEvent(
        uint256 indexed attackerId,
        uint256 indexed targetId,
        uint16 damage,
        bool wasCritical
    );

    event WhoWon(bool youWon);

    uint32 unarmedDamage = 15;

    modifier weaponCanBeUsedLevel(uint32 fighterLevel, uint32 weaponLevel) {
        require(
            fighterLevel >= weaponLevel,
            "You cannot use this weapon, your level is too small!"
        );
        _;
    }

    modifier noFriendlyAttacks(uint256 _targetId) {
        require(
            fighter_to_owner[_targetId] != _msgSender(),
            "You cannot attack your own Fighter!"
        );
        _;
    }

    function attack(
        uint256 _myFighterId,
        bool _hasOwnerWeapon,
        uint256 _myWeaponId,
        uint256 _targetFighterId,
        bool _hasTargetWeapon,
        uint256 _targetWeaponId
    ) external onlyOwnerOf(_myFighterId) noFriendlyAttacks(_targetFighterId) {
        Fighter storage _myFighter = fighters[_myFighterId];
        require(
            _myFighter.readyTime <= block.timestamp,
            "Your fighter is not yet ready to fight!"
        );
        _triggerCooldown(_myFighter);

        uint32 _myDamage = unarmedDamage;
        if (_hasOwnerWeapon) {
            require(
                _msgSender() == weapon_to_owner[_myWeaponId],
                "You are not the owner of this Weapon!"
            );

            Weapon memory myWeapon = weapons[_myWeaponId];

            require(
                _myFighter.level >= myWeapon.levelReq,
                "You cannot use this weapon, your level is too small!"
            );
            if (myWeapon.weapType == WeaponType.Slash) {
                require(
                    _myFighter.agility >= myWeapon.skillReq,
                    "You cannot use this weapon, your agility skill is insufficient!"
                );
            } else {
                require(
                    _myFighter.strength >= myWeapon.skillReq,
                    "You cannot use this weapon, your strength skill is insufficient!"
                );
            }

            if (
                (_myFighter.class == FighterClass.Samurai &&
                    myWeapon.weapType == WeaponType.Slash) ||
                (_myFighter.class == FighterClass.Warrior &&
                    myWeapon.weapType == WeaponType.Blunt)
            ) {
                _myDamage = myWeapon.damage.mul(2);
            } else {
                _myDamage = myWeapon.damage;
            }
        }

        Fighter storage _targetFighter = fighters[_targetFighterId];
        uint32 _targetDamage = unarmedDamage;
        if (_hasTargetWeapon) {
            require(
                fighter_to_owner[_targetFighterId] ==
                    weapon_to_owner[_targetWeaponId],
                "You are not the owner of this Weapon!"
            );

            Weapon memory targetWeapon = weapons[_targetWeaponId];

            require(
                _targetFighter.level >= targetWeapon.levelReq,
                "You cannot use this weapon, your level is too small!"
            );
            if (targetWeapon.weapType == WeaponType.Slash) {
                require(
                    _targetFighter.agility >= targetWeapon.skillReq,
                    "You cannot use this weapon, your agility skill is insufficient!"
                );
            } else {
                require(
                    _targetFighter.strength >= targetWeapon.skillReq,
                    "You cannot use this weapon, your strength skill is insufficient!"
                );
            }

            if (
                (_targetFighter.class == FighterClass.Samurai &&
                    targetWeapon.weapType == WeaponType.Slash) ||
                (_targetFighter.class == FighterClass.Warrior &&
                    targetWeapon.weapType == WeaponType.Blunt)
            ) {
                _targetDamage = targetWeapon.damage.mul(2);
            } else {
                _targetDamage = targetWeapon.damage;
            }
        }

        bool iWon = attackLogic(
            _myFighterId,
            _myFighter,
            _myDamage,
            _targetFighterId,
            _targetFighter,
            _targetDamage
        );
        if (iWon) {
            _fighterWonFight(_myFighterId);
            _fighterLostFight(_targetFighterId);
        } else {
            _fighterLostFight(_myFighterId);
            _fighterWonFight(_targetFighterId);
        }

        emit WhoWon(iWon);
    }

    function attackLogic(
        uint256 myFighterId,
        Fighter storage myFighter,
        uint32 myDamage,
        uint256 targetFighterId,
        Fighter storage targetFighter,
        uint32 targetDamage
    ) private returns (bool) {
        uint32 _myRemainingHP = uint32(myFighter.HP);
        if (myFighter.class == FighterClass.Druid) {
            _myRemainingHP = _myRemainingHP.add(25);
            uint32 bonus = myFighter.level.mul(5);
            _myRemainingHP = _myRemainingHP.add(bonus);
        }
        uint32 _targetRemainingHP = uint32(targetFighter.HP);
        if (targetFighter.class == FighterClass.Druid) {
            _targetRemainingHP = _targetRemainingHP.add(25);
            uint32 bonus = myFighter.level.mul(5);
            _targetRemainingHP = _targetRemainingHP.add(bonus);
        }
        uint16 _damageTaken;
        while (true) {
            // myFighter attacks
            _damageTaken = simulateAttack(
                myFighterId,
                myDamage,
                myFighter.luck,
                _msgSender(),
                targetFighterId,
                targetFighter.dexterity
            );

            if (_targetRemainingHP <= uint32(_damageTaken)) {
                return true;
            }

            _targetRemainingHP -= uint32(_damageTaken);

            // targetFighter attacks
            _damageTaken = simulateAttack(
                targetFighterId,
                targetDamage,
                targetFighter.luck,
                _msgSender(),
                myFighterId,
                myFighter.dexterity
            );

            if (_myRemainingHP <= uint32(_damageTaken)) {
                return false;
            }

            _myRemainingHP -= uint32(_damageTaken);
        }
        assert(_myRemainingHP <= 0 || _targetRemainingHP <= 0);
        return false; // this line of code will never be executed, it's here to shut the compiler up
    }

    function simulateAttack(
        uint256 attackerId,
        uint32 attackerDamage,
        uint16 attackerLck,
        address addressForRandomness,
        uint256 defenderId,
        uint16 defenderDex
    ) private returns (uint16) {
        if (
            _computeCriticalStrikeOrDodgeChance(
                addressForRandomness,
                defenderDex
            )
        ) {
            emit ArenaEvent(attackerId, defenderId, 0, false);
            return 0;
        } else {
            if (
                _computeCriticalStrikeOrDodgeChance(
                    addressForRandomness,
                    attackerLck
                )
            ) {
                emit ArenaEvent(
                    attackerId,
                    defenderId,
                    uint16(attackerDamage.mul(2)),
                    true
                );
                return uint16(attackerDamage.mul(2));
            } else {
                emit ArenaEvent(
                    attackerId,
                    defenderId,
                    uint16(attackerDamage),
                    false
                );
                return uint16(attackerDamage);
            }
        }
    }
}
