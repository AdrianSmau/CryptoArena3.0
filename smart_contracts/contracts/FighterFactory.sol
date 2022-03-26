// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/Ownable.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/fighters/FighterClasses.sol";

contract FighterFactory is Ownable {
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
        FighterClass class;
    }

    struct FighterDTO {
        Fighter fighter;
        address owner;
    }

    Fighter[] internal fighters;

    mapping(uint256 => address) internal fighter_to_owner;
    mapping(address => uint256) internal owner_fighters_count;

    modifier emptyBarracks() {
        require(
            owner_fighters_count[_msgSender()] == 0,
            "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
        );
        _;
    }

    modifier validName(string memory _name) {
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
        Fighter[] memory userFighters = _getMyFighters();
        bool nameFound = false;
        for (uint256 i = 0; i < userFighters.length; i++) {
            if (compareStrings(userFighters[i].name, _name)) {
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

    function _createFighter(string memory _name, FighterClass _class)
        external
        emptyBarracks
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
                _class
            )
        );
        uint256 id = fighters.length - 1;
        fighter_to_owner[id] = _msgSender();
        owner_fighters_count[_msgSender()] = owner_fighters_count[_msgSender()]
            .add(1);
        emit NewFighter(id, _name, block.timestamp, _class, _msgSender());
    }

    function _getMyFighters() public view returns (Fighter[] memory) {
        address _owner = _msgSender();
        uint256 toFetch = owner_fighters_count[_owner];
        Fighter[] memory myFighters = new Fighter[](toFetch);
        uint256 counter = 0;
        for (uint256 i = 0; i < fighters.length; i++) {
            if (fighter_to_owner[i] == _owner) {
                myFighters[counter] = fighters[i];
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
            allFightersDTOs[i] = (FighterDTO(fighters[i], fighter_to_owner[i]));
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
