// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/Context.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/weapons/WeaponTiers.sol";
import "./helpers/weapons/WeaponTypes.sol";

contract WeaponFactory is Context {
    using SafeMath for uint256;
    using SafeMath32 for uint32;

    event newWeapon(
        uint32 levelReq,
        uint256 timestamp,
        WeaponType indexed weapType,
        WeaponTier indexed tier,
        address indexed owner
    );

    struct Weapon {
        uint32 levelReq;
        uint32 skillReq;
        uint32 damage;
        WeaponType weapType;
        WeaponTier tier;
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
        uint32 _level,
        WeaponType _type,
        WeaponTier _tier
    ) external validLevel(_level) validType(_type) validTier(_tier) {
        uint32 currentSkillReq = 0;
        if (_tier == WeaponTier.S) currentSkillReq = 8;
        if (_tier == WeaponTier.A) currentSkillReq = 6;
        if (_tier == WeaponTier.B) currentSkillReq = 3;
        weapons.push(
            Weapon(
                _level,
                currentSkillReq,
                _computeWeaponDamage(_level, _tier),
                _type,
                _tier
            )
        );
        uint256 id = weapons.length - 1;
        weapon_to_owner[id] = _msgSender();
        owner_weapons_count[_msgSender()] = owner_weapons_count[_msgSender()]
            .add(1);
        emit newWeapon(_level, block.timestamp, _type, _tier, _msgSender());
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

    function _getMyWeapons() external view returns (Weapon[] memory) {
        address _owner = _msgSender();
        uint256 toFetch = owner_weapons_count[_owner];
        Weapon[] memory myWeapons = new Weapon[](toFetch);
        uint256 counter = 0;
        for (uint256 i = 0; i < weapons.length; i++) {
            if (weapon_to_owner[i] == _owner) {
                myWeapons[counter] = weapons[i];
                counter++;
                toFetch--;
                if (toFetch == 0) break;
            }
        }
        return myWeapons;
    }

    function _getWeaponsCount() external view returns (uint256) {
        return weapons.length;
    }
}
