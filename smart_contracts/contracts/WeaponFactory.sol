// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/weapons/WeaponTiers.sol";
import "./helpers/weapons/WeaponTypes.sol";

abstract contract WeaponFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    struct Weapon {
        uint32 levelReq;
        uint32 damage;
        uint16 skillReq;
        WeaponType weapType;
        WeaponTier tier;
    }

    struct WeaponDTO {
        Weapon weapon;
        uint256 id;
    }

    Weapon[] internal weapons;

    mapping(uint256 => address) internal weapon_to_owner;
    mapping(address => uint256) internal owner_weapons_count;

    modifier validLevel(uint32 _level) {
        require(
            _level >= 1,
            "The level you inserted for your Weapon is invalid!"
        );
        _;
    }

    modifier validType(WeaponType _type) {
        require(
            _type == WeaponType.Slash || _type == WeaponType.Blunt,
            "The type you inserted for your Weapon is invalid!"
        );
        _;
    }

    modifier validTier(WeaponTier _tier) {
        require(
            _tier == WeaponTier.S ||
                _tier == WeaponTier.A ||
                _tier == WeaponTier.B,
            "The type you inserted for your Weapon is invalid!"
        );
        _;
    }

    function _forgeWeapon(
        address _owner,
        uint32 _level,
        WeaponType _type,
        WeaponTier _tier
    ) internal validLevel(_level) validType(_type) validTier(_tier) {
        uint16 currentSkillReq = 0;
        if (_tier == WeaponTier.S) {
            currentSkillReq = 8;
        }
        if (_tier == WeaponTier.A) {
            currentSkillReq = 6;
        }
        if (_tier == WeaponTier.B) {
            currentSkillReq = 3;
        }
        weapons.push(
            Weapon(
                _level,
                _computeWeaponDamage(_level, _tier),
                currentSkillReq,
                _type,
                _tier
            )
        );
        weapon_to_owner[weapons.length - 1] = _owner;
        owner_weapons_count[_owner] = owner_weapons_count[_owner].add(1);
    }

    function _computeWeaponDamage(uint32 _level, WeaponTier _tier)
        private
        pure
        returns (uint32)
    {
        if (_tier == WeaponTier.B) return _level.mul(2);
        if (_tier == WeaponTier.S) return _level.mul(4);
        return _level.mul(3);
    }

    function _getUserWeapons(address _owner)
        public
        view
        returns (WeaponDTO[] memory)
    {
        uint256 toFetch = owner_weapons_count[_owner];
        WeaponDTO[] memory myWeapons = new WeaponDTO[](toFetch);
        if (toFetch == 0) {
            return myWeapons;
        }
        uint256 counter = 0;
        for (uint256 i = 0; i < weapons.length; i++) {
            if (weapon_to_owner[i] == _owner) {
                myWeapons[counter] = WeaponDTO(weapons[i], i);
                counter++;
                toFetch--;
                if (toFetch == 0) {
                    break;
                }
            }
        }
        return myWeapons;
    }

    /*function _getWeaponsCount() external view returns (uint256) {
        return weapons.length;
    }*/
}
