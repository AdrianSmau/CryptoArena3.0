// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract FighterFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewFighter(uint256 fighterId, string name);

    uint256 cooldownTime = 1 days;

    struct Fighter {
        string name;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Fighter[] internal fighters;

    mapping(uint256 => address) internal fighter_to_owner;
    mapping(address => uint256) internal owner_fighters_count;

    function _createFighter(string memory _name) public {
        fighters.push(
            Fighter(_name, 1, uint32(block.timestamp + cooldownTime), 0, 0)
        );
        uint256 id = fighters.length - 1;
        fighter_to_owner[id] = _msgSender();
        owner_fighters_count[_msgSender()] = owner_fighters_count[_msgSender()]
            .add(1);
        emit NewFighter(id, _name);
    }

    function _getMyFighters() external view returns (Fighter[] memory) {
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
}
