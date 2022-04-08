// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/fighters/FighterClasses.sol";

abstract contract FighterFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint256 cooldownTime = 1 minutes;

    struct Fighter {
        uint16 winCount;
        uint16 lossCount;
        uint16 HP;
        uint16 strength;
        uint16 agility;
        uint16 dexterity;
        uint16 luck;
        uint16 currentXP;
        uint16 levelUpXP;
        uint16 spendablePoints;
        uint32 level;
        uint32 readyTime;
        FighterClass class;
        string name;
    }

    struct FighterDTO {
        address owner;
        Fighter fighter;
        uint256 id;
    }

    struct FighterBarracksDTO {
        Fighter fighter;
        uint256 id;
    }

    Fighter[] internal fighters;

    mapping(uint256 => address) internal fighter_to_owner;
    mapping(address => uint256) internal owner_fighters_count;
    mapping(address => uint16) internal user_available_pupils;

    modifier emptyBarracks() {
        require(
            owner_fighters_count[_msgSender()] == 0,
            "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
        );
        _;
    }

    modifier validName(string calldata _name) {
        require(
            bytes(_name).length != 0,
            "The name you inserted for your Fighter is invalid!"
        );
        _;
    }

    modifier validClass(FighterClass _class) {
        require(
            _class == FighterClass.Warrior ||
                _class == FighterClass.Samurai ||
                _class == FighterClass.Druid,
            "The class you inserted for your Fighter is invalid!"
        );
        _;
    }

    modifier uniqueName(string memory _name) {
        FighterBarracksDTO[] memory userFighters = _getUserFighters(
            _msgSender()
        );
        bool nameFound = false;
        for (uint256 i = 0; i < userFighters.length; i++) {
            if (compareStrings(userFighters[i].fighter.name, _name)) {
                nameFound = true;
                break;
            }
        }
        require(
            !nameFound,
            "The name you inserted for your Fighter is already used!"
        );
        _;
    }

    function _createFirstFighter(string calldata _name, FighterClass _class)
        external
        emptyBarracks
    {
        _createFighter(_name, _class);
        user_available_pupils[_msgSender()] = 0;
    }

    function _createFighter(string calldata _name, FighterClass _class)
        internal
        validName(_name)
        validClass(_class)
        uniqueName(_name)
    {
        fighters.push(
            Fighter(
                0,
                0,
                100,
                1,
                1,
                1,
                1,
                0,
                100,
                0,
                1,
                uint32(block.timestamp.add(cooldownTime)),
                _class,
                _name
            )
        );
        uint256 id = fighters.length - 1;
        fighter_to_owner[id] = _msgSender();
        owner_fighters_count[_msgSender()] = owner_fighters_count[_msgSender()]
            .add(1);
    }

    function _getUserFighters(address _owner)
        public
        view
        returns (FighterBarracksDTO[] memory)
    {
        uint256 toFetch = owner_fighters_count[_owner];
        FighterBarracksDTO[] memory myFighters = new FighterBarracksDTO[](
            toFetch
        );
        if (toFetch == 0) {
            return myFighters;
        }
        uint256 counter = 0;
        for (uint256 i = 0; i < fighters.length; i++) {
            if (fighter_to_owner[i] == _owner) {
                myFighters[counter] = FighterBarracksDTO(fighters[i], i);
                counter++;
                toFetch--;
                if (toFetch == 0) {
                    break;
                }
            }
        }
        return myFighters;
    }

    function _getLatestFighters(uint256 latest)
        external
        view
        returns (FighterDTO[] memory)
    {
        require(latest >= 0 && latest <= fighters.length);
        if (latest == 0) {
            latest = fighters.length;
        }
        FighterDTO[] memory allFightersDTOs = new FighterDTO[](latest);
        if (fighters.length == 0) {
            return allFightersDTOs;
        }
        uint256 counter = 0;
        for (
            uint256 i = fighters.length - 1;
            i >= fighters.length - latest;
            i--
        ) {
            allFightersDTOs[counter] = (
                FighterDTO(fighter_to_owner[i], fighters[i], i)
            );
            counter++;
            if (counter == latest) {
                break;
            }
        }
        return allFightersDTOs;
    }

    function _getFightersCount() external view returns (uint256) {
        return fighters.length;
    }

    function _getMyAvailablePupils() external view returns (uint256) {
        return user_available_pupils[_msgSender()];
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
