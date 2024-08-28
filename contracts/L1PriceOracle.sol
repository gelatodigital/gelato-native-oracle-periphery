// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {
    Initializable
} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract L1PriceOracle is Initializable {
    IPyth public pyth;
    address public dedicatedMsgSender;

    event PricesUpdated(bytes32[] ids, PythStructs.Price[] prices);

    function initialize(
        address _pyth,
        address _dedicatedMsgSender
    ) external initializer {
        pyth = IPyth(_pyth);
        dedicatedMsgSender = _dedicatedMsgSender;
    }

    // solhint-disable-next-line no-empty-blocks
    function deposit() external payable {}

    // @dev '_ids' do not necessarily correspond to '_updateData'
    function updatePrices(
        bytes32[] calldata _ids,
        bytes[] calldata _updateData
    ) external {
        // solhint-disable-next-line custom-errors
        require(msg.sender == dedicatedMsgSender, "Only dedicated msg.sender");

        uint256 fee = pyth.getUpdateFee(_updateData);
        pyth.updatePriceFeeds{value: fee}(_updateData);

        PythStructs.Price[] memory prices = new PythStructs.Price[](
            _ids.length
        );
        for (uint256 i = 0; i < _ids.length; i++)
            prices[i] = pyth.getPrice(_ids[i]);

        emit PricesUpdated(_ids, prices);
    }
}
