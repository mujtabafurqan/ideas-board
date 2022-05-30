// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";



contract IdeaBoard {

    using Counters for Counters.Counter;
    Counters.Counter private _Ids;

    struct idea{
        uint id;
        uint upvotes;
        uint downvotes;
        string title;
        string description;
        address author;
    }

    mapping(uint => idea) ideaList;

    IERC721 NFT = IERC721(0xA6Fa50c9817D47ec2608c0159C9cE666b95260Fd);

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function upvote(uint id) public {
        ideaList[id].upvotes++;
        console.log("%s has been upvoted!", ideaList[id].id);
    }

    function downvote(uint id) public {
        ideaList[id].downvotes++;
        console.log("%s has been downvoted!", ideaList[id].id);
    }

    function createIdea(string memory title, string memory description) public {

        //creatre only when they own a token 
        try NFT.balanceOf(msg.sender) returns (uint noOfTokens) {
            // check if tokens exist
            require(noOfTokens != 0, "no tokens");
            uint256 newId = _Ids.current();
            ideaList[newId] = idea(newId, 0, 0, title,description, msg.sender);
            _Ids.increment();
            console.log("%s has been created!", ideaList[newId].id);
            
        } catch (bytes memory) {
            // No tokens owned by user
            console.log("No Tokens for %s", msg.sender);
        }
        
    }

    function getIdea(uint id) public view returns (uint, uint, uint, string memory, string memory, address) {
        return (ideaList[id].id, ideaList[id].upvotes, ideaList[id].downvotes, ideaList[id].title, ideaList[id].description, ideaList[id].author);
    }

    function hasAccess() public view returns (bool accessible) {
        try NFT.balanceOf(msg.sender) returns (uint noOfTokens) {
            // First token owned by user
            if(noOfTokens > 0 ){
                return true;
            }else{
                return false;
            }          
        } catch (bytes memory) {
            // No tokens owned by user
            console.log("error occcured fetching nfts");
        }
    }

}