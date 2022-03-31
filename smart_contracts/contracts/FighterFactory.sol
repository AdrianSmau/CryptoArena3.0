// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./openzeppelin/Ownable.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/fighters/FighterClasses.sol";

abstract contract FighterFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewFighter(
        uint256 fighterId,
        string name,
        uint256 timestamp,
        FighterClass indexed fighterClass,
        address indexed owner
    );

    uint256 cooldownTime = 1 days;

    struct Fighter {
        string name;
        uint32 level;
        uint32 readyTime;
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
        FighterClass class;
    }

    struct FighterDTO {
        uint256 id;
        Fighter fighter;
        address owner;
    }

    struct FighterBarracksDTO {
        uint256 id;
        Fighter fighter;
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
        bytes memory _nameBytes = bytes(_name);
        require(
            _nameBytes.length != 0,
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
        FighterBarracksDTO[] memory userFighters = _getMyFighters();
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
    }

    function _createFighter(string calldata _name, FighterClass _class)
        internal
        validName(_name)
        validClass(_class)
    {
        fighters.push(
            Fighter(
                _name,
                1,
                uint32(block.timestamp.add(cooldownTime)),
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
                _class
            )
        );
        uint256 id = fighters.length - 1;
        fighter_to_owner[id] = _msgSender();
        owner_fighters_count[_msgSender()] = owner_fighters_count[_msgSender()]
            .add(1);
        user_available_pupils[_msgSender()] = 0;
        emit NewFighter(id, _name, block.timestamp, _class, _msgSender());
    }

    function _getMyFighters()
        public
        view
        returns (FighterBarracksDTO[] memory)
    {
        address _owner = _msgSender();
        uint256 toFetch = owner_fighters_count[_owner];
        FighterBarracksDTO[] memory myFighters = new FighterBarracksDTO[](
            toFetch
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < fighters.length; i++) {
            if (fighter_to_owner[i] == _owner) {
                myFighters[counter] = FighterBarracksDTO(i, fighters[i]);
                counter++;
                toFetch--;
                if (toFetch == 0) break;
            }
        }
        return myFighters;
    }

    function _getFightersCount() external view returns (uint256) {
        return fighters.length;
    }

    function _getAllFighters() external view returns (FighterDTO[] memory) {
        FighterDTO[] memory allFightersDTOs = new FighterDTO[](fighters.length);
        for (uint256 i = 0; i < fighters.length; i++) {
            allFightersDTOs[i] = FighterDTO(
                i,
                fighters[i],
                fighter_to_owner[i]
            );
        }
        return allFightersDTOs;
    }

    function _getLatestFighters() external view returns (FighterDTO[] memory) {
        FighterDTO[] memory allFightersDTOs = new FighterDTO[](6);
        for (uint256 i = fighters.length; i > 0; i--) {
            allFightersDTOs[i] = (
                FighterDTO(i, fighters[i], fighter_to_owner[i])
            );
            if (allFightersDTOs.length == 6) break;
        }
        return allFightersDTOs;
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
