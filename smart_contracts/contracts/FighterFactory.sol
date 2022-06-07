// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./openzeppelin/SafeMath.sol";
import "./helpers/fighters/FighterClasses.sol";

abstract contract FighterFactory is Ownable, ERC165, IERC721, IERC721Metadata {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;
    using Address for address;
    using Strings for uint256;

    uint256 immutable cooldownTime = 1 minutes;

    struct Fighter {
        bool isForSale;
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

    // Token name
    string private _name = "CryptoArenaFighters";

    // Token symbol
    string private _symbol = "Fighter";

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor() {
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC721: balance query for the zero address"
        );
        return owner_fighters_count[owner];
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        address owner = fighter_to_owner[tokenId];
        require(
            owner != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return owner;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function _baseURI() internal pure returns (string memory) {
        return "";
    }

    function approve(address to, uint256 tokenId) public override {
        address owner = fighter_to_owner[tokenId];
        require(to != owner, "ERC721: approval to current owner");

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    function getApproved(uint256 tokenId)
        public
        view
        override
        returns (address)
    {
        require(
            _exists(tokenId),
            "ERC721: approved query for nonexistent token"
        );

        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved)
        public
        override
    {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        override
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        //solhint-disable-next-line max-line-length
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _safeTransfer(from, to, tokenId, _data);
    }

    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal {
        _transfer(from, to, tokenId);
        require(
            _checkOnERC721Received(from, to, tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return fighter_to_owner[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        );
        address owner = fighter_to_owner[tokenId];
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }

    function _safeMint(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId, "");
    }

    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        emit Transfer(address(0), to, tokenId);
    }

    /*function _burn(uint256 tokenId) internal {
        revert("You cannot delete/burn a Fighter!");
    }*/

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        require(
            fighter_to_owner[tokenId] == from,
            "ERC721: transfer from incorrect owner"
        );
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        owner_fighters_count[from] = owner_fighters_count[from].sub(1);
        owner_fighters_count[to] = owner_fighters_count[to].add(1);
        fighter_to_owner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(fighter_to_owner[tokenId], to, tokenId);
    }

    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal {
        require(owner != operator, "ERC721: approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try
                IERC721Receiver(to).onERC721Received(
                    _msgSender(),
                    from,
                    tokenId,
                    _data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC721: transfer to non ERC721Receiver implementer"
                    );
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
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

    modifier notForSale(uint256 _fighterId) {
        require(!fighters[_fighterId].isForSale);
        _;
    }

    modifier forSale(uint256 _fighterId) {
        require(fighters[_fighterId].isForSale);
        _;
    }

    modifier emptyBarracks() {
        require(
            owner_fighters_count[_msgSender()] == 0,
            "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
        );
        _;
    }

    modifier validName(string calldata _givenName) {
        require(
            bytes(_givenName).length != 0,
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

    modifier uniqueName(string memory _givenName) {
        FighterBarracksDTO[] memory userFighters = _getUserFighters(
            _msgSender()
        );
        bool nameFound = false;
        for (uint256 i = 0; i < userFighters.length; i++) {
            if (compareStrings(userFighters[i].fighter.name, _givenName)) {
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

    function createFirstFighter(
        string calldata _givenName,
        FighterClass _class
    ) external emptyBarracks {
        _createFighter(_givenName, _class);
        user_available_pupils[_msgSender()] = 0;
    }

    function _createFighter(string calldata _givenName, FighterClass _class)
        internal
        validName(_givenName)
        validClass(_class)
        uniqueName(_givenName)
    {
        fighters.push(
            Fighter(
                false,
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
                _givenName
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
