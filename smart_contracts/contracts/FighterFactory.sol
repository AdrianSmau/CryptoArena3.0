// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/fighters/FighterClasses.sol";

abstract contract FighterFactory is Ownable, ERC721 {
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

    mapping(FighterClass => string) internal fighter_classes_string;
    mapping(FighterClass => string) internal fighter_classes_images_path;

    constructor() ERC721("CryptoArenaFighters", "Fighter") {
        fighter_classes_string[FighterClass.Warrior] = "Warrior";
        fighter_classes_string[FighterClass.Samurai] = "Samurai";
        fighter_classes_string[FighterClass.Druid] = "Druid";

        fighter_classes_images_path[
            FighterClass.Warrior
        ] = "https://i.imgur.com/yhJOzNT.png";
        fighter_classes_images_path[
            FighterClass.Samurai
        ] = "https://i.imgur.com/ttEuemz.png";
        fighter_classes_images_path[
            FighterClass.Druid
        ] = "https://i.imgur.com/aS92Faz.png";
    }

    modifier onlyOwnerOf(uint256 _fighterId) {
        require(
            _msgSender() == fighter_to_owner[_fighterId],
            "You are not the owner of this Fighter!"
        );
        _;
    }

    function tokenURI(uint256 _id)
        public
        view
        override
        returns (string memory)
    {
        Fighter memory _fighter = fighters[_id];

        string memory HP_str = Strings.toString(_fighter.HP);
        string memory level_str = Strings.toString(_fighter.level);
        string memory STR_str = Strings.toString(_fighter.strength);
        string memory AGL_str = Strings.toString(_fighter.agility);
        string memory LCK_str = Strings.toString(_fighter.luck);
        string memory DEX_str = Strings.toString(_fighter.dexterity);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "[Fighter #',
                Strings.toString(_id),
                "] - ",
                _fighter.name,
                " the ",
                fighter_classes_string[_fighter.class],
                '", "description": "This NFT represents a CryptoArena3.0 Fighter!", "image": "',
                fighter_classes_images_path[_fighter.class],
                '", "attributes": [{"trait_type": "level", "value": ',
                level_str,
                "},",
                '{"trait_type": "Health Points", "value": ',
                HP_str,
                "},",
                '{"trait_type": "Strength", "value": ',
                STR_str,
                "},",
                '{"trait_type": "Agility", "value": ',
                AGL_str,
                "},",
                '{"trait_type": "Luck", "value": ',
                LCK_str,
                "},",
                '{"trait_type": "Dexterity", "value": ',
                DEX_str,
                "}]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

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
        _safeMint(_msgSender(), id);
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
