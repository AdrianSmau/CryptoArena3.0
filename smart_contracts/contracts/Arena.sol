// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FighterEvolution.sol";

contract Arena is FighterEvolution {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint32 unarmedDamage = 10;

    modifier onlyOwnerOf(uint256 _fighterId) {
        require(
            _msgSender() == fighter_to_owner[_fighterId],
            "You are not the owner of this Fighter!"
        );
        _;
    }

    modifier isReady(uint32 readyTime) {
        require(
            readyTime <= block.timestamp,
            "Your fighter is not yet ready to fight!"
        );
        _;
    }

    modifier weaponCanBeUsedLevel(uint32 fighterLevel, uint32 weaponLevel) {
        require(
            fighterLevel >= weaponLevel,
            "You cannot use this weapon, your level is too small!"
        );
        _;
    }

    function attack(
        uint256 _myFighterId,
        bool _hasOwnerWeapon,
        uint256 _myWeaponId,
        uint256 _targetFighterId
    ) external onlyOwnerOf(_myFighterId) {
        Fighter storage _myFighter = fighters[_myFighterId];
        Fighter storage _targetFighter = fighters[_targetFighterId];
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
        (
            bool _hasTargetWeapon,
            uint256 _targetWeaponId,
            uint32 _targetDamage
        ) = chooseTargetWeapon(
                fighter_to_owner[_targetFighterId],
                _targetFighter.level,
                _targetFighter.strength,
                _targetFighter.agility,
                _targetFighter.class
            );

        attackLogic(_myFighter, _myDamage, _targetFighter, _targetDamage);
    }

    function attackLogic(
        Fighter storage myFighter,
        uint32 myDamage,
        Fighter storage targetFighter,
        uint32 targetDamage
    ) private isReady(myFighter.readyTime) {}

    function chooseTargetWeapon(
        address _target,
        uint32 targetLevel,
        uint16 targetSTR,
        uint16 targetAGL,
        FighterClass targetClass
    )
        private
        view
        returns (
            bool,
            uint256,
            uint32
        )
    {
        uint32 bestDamage = 0;
        bool weaponFound = false;
        uint256 bestWeaponId = 0;
        Weapon[] memory targetWeapons = _getTargetWeapons(_target);
        for (uint256 i = 0; i < targetWeapons.length; i++) {
            if (targetWeapons[i].levelReq <= targetLevel) {
                if (targetWeapons[i].weapType == WeaponType.Slash) {
                    if (targetWeapons[i].skillReq <= targetAGL) {
                        if (targetClass == FighterClass.Samurai) {
                            if (targetWeapons[i].damage.mul(2) > bestDamage) {
                                bestDamage = targetWeapons[i].damage.mul(2);
                                if (weaponFound == false) {
                                    weaponFound = true;
                                }
                                bestWeaponId = i;
                            }
                        } else {
                            if (targetWeapons[i].damage > bestDamage) {
                                bestDamage = targetWeapons[i].damage;
                                if (weaponFound == false) {
                                    weaponFound = true;
                                }
                                bestWeaponId = i;
                            }
                        }
                    }
                } else {
                    if (targetWeapons[i].skillReq <= targetSTR) {
                        if (targetClass == FighterClass.Warrior) {
                            if (targetWeapons[i].damage.mul(2) > bestDamage) {
                                bestDamage = targetWeapons[i].damage.mul(2);
                                if (weaponFound == false) {
                                    weaponFound = true;
                                }
                                bestWeaponId = i;
                            }
                        } else {
                            if (targetWeapons[i].damage > bestDamage) {
                                bestDamage = targetWeapons[i].damage;
                                if (weaponFound == false) {
                                    weaponFound = true;
                                }
                                bestWeaponId = i;
                            }
                        }
                    }
                }
            }
        }
        if (weaponFound) {
            return (weaponFound, bestWeaponId, bestDamage);
        } else {
            return (weaponFound, bestWeaponId, unarmedDamage);
        }
    }

    function _triggerCooldown(Fighter storage _myFighter) private {
        _myFighter.readyTime = uint32(block.timestamp + cooldownTime);
    }
}
