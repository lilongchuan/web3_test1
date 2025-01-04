// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
    uint public counter;

    constructor() {}

    function count() public {
        counter += 1;
    }
}
