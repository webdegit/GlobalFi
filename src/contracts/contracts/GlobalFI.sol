// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);
}

struct PlanStruct {
    uint8 planId;
    string name;
    uint256 value;
    uint256 maxLimitMultiplier;
}

struct SupportedTokensStruct {
    address contractAddress;
    uint256 decimals;
    bool isStable;
    address aggregatorAddress;
    bool isEnaled;
}

struct TeamStruct {
    uint256 teamId;
    uint256 teamLevel;
}

struct BusinessStruct {
    uint256 selfBusiness;
    uint256 directBusiness;
    uint256 teamBusiness;
    // uint256 spillOverBusiness;
}

struct RewardsStruct {
    uint256 referralRewards;
    uint256 spillOverRewards;
    uint256 globalRewards;
}

struct RefereeStruct {
    uint256 refereeId;
    uint256 assignedTo;
    uint256 assignedFrom;
}

struct AccountStruct {
    address selfAddress;
    uint256[] ids;
    uint256[] regeneratedIds;
}

struct PoolIdStruct {
    bool isInPool;
    uint8 currentPool;
    uint256 currentPoolIndex;
}

struct RegeneratedIdsStruct {
    bool isThisRegenerated;
    uint256[] regenratedIds;
    uint256 regeneratedIdBy;
}

struct IdStruct {
    uint256 id;
    address owner;
    uint256 referrerId;
    uint256 parentId;
    RefereeStruct[] refereeIds;
    TeamStruct[] team;
    BusinessStruct business;
    RewardsStruct rewards;
    PoolIdStruct pool;
    RegeneratedIdsStruct regenratedIds;
}

struct PoolStruct {
    uint8 poolId;
    uint256 rewardToDistribute;
    uint256 idsToRegenerate;
    uint8 minUserCounter;
    uint256 count;
    uint256 userCountToUpgrade;
    uint256[] userIds;
    uint256 totalRewardDistributed;
}

contract GlobalFi is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address[] private _users;
    uint256 private _ids;
    uint256[] private _nonGlobalIds;
    uint256 private _nonGlobalIdIncrement;

    uint256[] private _levelRates;

    uint256 private _maxRefereeLimit;
    uint8 private _teamLevelsToCount;

    uint256 private _registrationAmountInUSD;

    address[] private _taxBeneficiaryAddresses;

    uint256 private _taxPer;
    uint256 private _totalTaxCollected;
    uint256 private _pendingTaxToWithdraw;

    uint256 private _totalReferralPaid;
    uint256 private _totalValueRegistered;

    SupportedTokensStruct[] private _supportedTokensList;

    bool private _reentrancy;

    mapping(address => AccountStruct) private _mappingAccounts;
    mapping(uint256 => IdStruct) private _mappingIds;
    mapping(address => SupportedTokensStruct) private _mappingSupportedToken;
    mapping(uint8 => PoolStruct) private _mappingPools;

    event SelfAddressUpdated(address newAddress);
    event IdUpdated(address userAddress, uint256 id);
    event IdOwnerUpdated(address userAddress, uint256 id);
    event ReferrerUpdated(uint256 referrerId, uint256 userId);
    event RefereeAssigned(uint256 parentId, uint256 referrerId, uint256 userId);
    event TeamUpdated(uint256 parent, uint256 userId);
    event TeamNonGlobalAdded(address parent, address user);
    event TeamNonGlobaRemoved(address parent, address user);
    event SelfBusinessUpdated(uint256 userId, uint256 valueInWei);
    event DirectBusinessUpdated(
        uint256 referrerId,
        uint256 userId,
        uint256 valueInWei
    );
    event TeamBusinessUpdated(
        uint256 referrerId,
        uint256 userId,
        uint256 valueInWei,
        uint256 level
    );

    event ReferralDistributed(
        uint256 referrerId,
        uint256 userId,
        uint256 referralValue,
        uint256 level
    );

    event IdUpgradedInPool(uint256 id, uint8 poolId);
    event DistributedPoolReward(uint256 id, uint8 poolId, uint256 rewardInWei);

    modifier ReentrancyGuard() {
        require(!_reentrancy, "ReentrancyGuard(): Contract ReentrancyGuard");
        _reentrancy = true;
        _;
        _reentrancy = false;
    }

    /**
     * @dev Initializes the contract with default values and sets configuration parameters.
     *      This function is typically called only once during contract deployment.
     */
    function initialize() public initializer {
        // Set the maximum limit for referees to 2.
        _maxRefereeLimit = 2;

        // Set the initial rate for the first team level to 50%.
        _levelRates = [50];

        // Set the maximum number of team levels to be considered for counting.
        _teamLevelsToCount = 20;

        _taxBeneficiaryAddresses.push(msg.sender);
        _taxBeneficiaryAddresses.push(
            0x14A8EE34eDcb63f88d301215862ff5E017eBdFf1
        );

        _registrationAmountInUSD = 20 * 1 ether;

        _taxPer = 5;

        // Initialize Pausable, Ownable, and UUPSUpgradeable modules.
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getSupportedCurrencies()
        external
        view
        returns (SupportedTokensStruct[] memory)
    {
        return _supportedTokensList;
    }

    /**
     * @dev Adds a supported base currency to the system.
     * @param _tokenContractAddress The address of the token contract to be added as a base currency.
     * @param _isStable A boolean indicating whether the added token is a stablecoin or not.
     * @param _aggregatorContractAddress The address of the price aggregator contract for the token.
     * @notice This function is only callable by the owner of the contract.
     * @notice It checks if the token is not already added to the system before adding.
     * @dev It initializes the SupportedTokensStruct for the added token with relevant information such as decimals, stability, aggregator, and enables it.
     * @dev The added token is also appended to the list of supported tokens.
     */

    function addBaseCurrency(
        address _tokenContractAddress,
        bool _isStable,
        address _aggregatorContractAddress
    ) external onlyOwner {
        require(
            _mappingSupportedToken[_tokenContractAddress].contractAddress ==
                address(0),
            "pushSupportedTokenToList(): Token is already added."
        );

        _mappingSupportedToken[_tokenContractAddress] = SupportedTokensStruct({
            contractAddress: _tokenContractAddress,
            decimals: IERC20_EXTENDED(_tokenContractAddress).decimals(),
            isStable: _isStable,
            aggregatorAddress: _aggregatorContractAddress,
            isEnaled: true
        });

        _supportedTokensList.push(
            _mappingSupportedToken[_tokenContractAddress]
        );
    }

    /**
     * @dev Removes or disables a supported base currency in the system.
     * @param _tokenContractAddress The address of the token contract to be removed or disabled.
     * @param _status A boolean indicating whether to enable (true) or disable (false) the token.
     * @notice This function is only callable by the owner of the contract.
     * @notice It checks if the token is already added to the system before attempting to remove or disable it.
     * @notice It also checks if the status change is necessary to avoid unnecessary state changes.
     * @dev It updates the `isEnaled` status of the specified token based on the provided status parameter.
     */

    function removeBaseCurrency(
        address _tokenContractAddress,
        bool _status
    ) external onlyOwner {
        require(
            _mappingSupportedToken[_tokenContractAddress].contractAddress !=
                address(0),
            "setSupportedTokenStatus(): Token is not added added."
        );

        require(
            _mappingSupportedToken[_tokenContractAddress].isEnaled != _status,
            "setSupportedTokenStatus(): Token status is already same as mentioned."
        );

        _mappingSupportedToken[_tokenContractAddress].isEnaled = _status;
    }

    function getPools(uint8 _poolId) external view returns (PoolStruct memory) {
        return _mappingPools[_poolId];
    }

    function getIdsByPool(
        uint8 _poolId
    ) external view returns (uint256[] memory) {
        return _mappingPools[_poolId].userIds;
    }

    function setPools(
        uint8[] calldata _poolId,
        uint256[] calldata _rewardToDistributeInDecimals,
        uint256[] calldata _idsToGenerate,
        uint8 _minUserCounter
    ) external onlyOwner {
        for (uint8 i; i < _poolId.length; ++i) {
            PoolStruct storage poolsAccount = _mappingPools[_poolId[i]];

            poolsAccount.poolId = _poolId[i];
            poolsAccount.rewardToDistribute =
                _rewardToDistributeInDecimals[i] *
                1 ether;
            poolsAccount.idsToRegenerate = _idsToGenerate[i];

            poolsAccount.minUserCounter = _minUserCounter;
        }
    }

    function _pushIdToInitialPool(IdStruct storage _idAccount) private {
        if (_idAccount.refereeIds.length == _maxRefereeLimit) {
            PoolStruct storage poolAccount = _mappingPools[1];

            _idAccount.pool.isInPool = true;
            _idAccount.pool.currentPool = 1;
            poolAccount.userIds.push(_idAccount.id);
            _idAccount.pool.currentPoolIndex = poolAccount.userIds.length;
            poolAccount.count++;

            emit IdUpgradedInPool(_idAccount.id, 1);
        }
    }

    function _upgradeIdToPool(
        address _tokenAddress,
        uint256 _adminTax
    ) private {
        for (uint8 i = 1; i < 20; i++) {
            PoolStruct storage poolAccount = _mappingPools[i];
            uint256 currentId = _ids;

            if (poolAccount.userIds.length > 0) {
                if (poolAccount.poolId == 0) {
                    break;
                }

                IdStruct storage idAccount = _mappingIds[
                    poolAccount.userIds[poolAccount.userCountToUpgrade]
                ];

                if (
                    poolAccount.count == poolAccount.minUserCounter ||
                    poolAccount.count > poolAccount.minUserCounter
                ) {
                    if (
                        poolAccount.idsToRegenerate > 0 &&
                        !idAccount.regenratedIds.isThisRegenerated
                    ) {
                        for (uint8 j; j < poolAccount.idsToRegenerate; ++j) {
                            IdStruct storage regeneratedIdAccount = _mappingIds[
                                currentId + j + 1
                            ];

                            regeneratedIdAccount.id = currentId + j + 1;
                            regeneratedIdAccount.owner = idAccount.owner;
                            regeneratedIdAccount.parentId = idAccount.id;

                            _spillOver(idAccount, regeneratedIdAccount);

                            regeneratedIdAccount
                                .regenratedIds
                                .isThisRegenerated = true;
                            regeneratedIdAccount
                                .regenratedIds
                                .regeneratedIdBy = idAccount.id;

                            idAccount.regenratedIds.regenratedIds.push(
                                regeneratedIdAccount.id
                            );

                            PoolStruct
                                storage initialPoolAccount = _mappingPools[1];

                            regeneratedIdAccount.pool.isInPool = true;
                            regeneratedIdAccount.pool.currentPool = 1;
                            initialPoolAccount.userIds.push(
                                regeneratedIdAccount.id
                            );
                            regeneratedIdAccount
                                .pool
                                .currentPoolIndex = initialPoolAccount
                                .userIds
                                .length;
                            initialPoolAccount.count++;

                            emit IdUpgradedInPool(regeneratedIdAccount.id, 1);

                            // _pushIdToInitialPool(regeneratedIdAccount);
                        }

                        _ids += poolAccount.idsToRegenerate;
                    }

                    PoolStruct storage nextPoolAccount = _mappingPools[i + 1];
                    nextPoolAccount.userIds.push(
                        poolAccount.userIds[poolAccount.userCountToUpgrade]
                    );

                    emit IdUpgradedInPool(
                        poolAccount.userIds[poolAccount.userCountToUpgrade],
                        i + 1
                    );

                    nextPoolAccount.count++;

                    IERC20Upgradeable(_tokenAddress).transfer(
                        idAccount.owner,
                        _deductAdminFees(
                            _weiToTokens(
                                poolAccount.rewardToDistribute,
                                _tokenAddress
                            ),
                            _adminTax
                        )
                    );

                    emit DistributedPoolReward(
                        poolAccount.userIds[poolAccount.userCountToUpgrade],
                        poolAccount.poolId,
                        poolAccount.rewardToDistribute
                    );

                    idAccount.pool.currentPool = nextPoolAccount.poolId;
                    idAccount.pool.currentPoolIndex = nextPoolAccount
                        .userIds
                        .length;

                    idAccount.rewards.globalRewards += poolAccount
                        .rewardToDistribute;

                    poolAccount.totalRewardDistributed += poolAccount
                        .rewardToDistribute;

                    poolAccount.count = 0;
                    poolAccount.userCountToUpgrade++;
                }
            } else {
                break;
            }
        }
    }

    /**
     * @dev Internal function to update the self address of a user in their account structure.
     * @param _userAccount The storage reference to the AccountStruct of the user.
     * @param _userAddress The new address to be set as the user's self address.
     * @notice This function updates the self address of a user only if the current self address is null (address(0)) and the new address is not null.
     * @dev It sets the new address as the self address in the user's account structure and emits a `SelfAddressUpdated` event.
     */

    function _updateSelfAddress(
        AccountStruct storage _userAccount,
        address _userAddress
    ) private {
        if (
            _userAccount.selfAddress == address(0) && _userAddress != address(0)
        ) {
            _userAccount.selfAddress = _userAddress;
            emit SelfAddressUpdated(_userAddress);
        }
    }

    function _getNextId() private view returns (uint256 nextId) {
        nextId = _ids + 1;
    }

    function _updateId(
        IdStruct storage _idAccount,
        AccountStruct storage _userAccount
    ) private returns (uint256 id) {
        require(_idAccount.id == 0, "_updateId(): Id is already created.");
        _ids++;
        id = _ids;
        _idAccount.id = id;

        _userAccount.ids.push(id);
        emit IdUpdated(_userAccount.selfAddress, id);

        _idAccount.owner = _userAccount.selfAddress;
        emit IdOwnerUpdated(_userAccount.selfAddress, id);
    }

    function _pushIdToNonGlobal(IdStruct memory _userIdAccount) private {
        _nonGlobalIds.push(_userIdAccount.id);
    }

    function _removeIdFromNonGlobal(IdStruct memory _idAccount) private {
        if (_checkIfMaxRefereeLimit(_idAccount)) {
            _nonGlobalIds[0] = _nonGlobalIds[_nonGlobalIds.length - 1];
            _nonGlobalIds.pop();
        }
    }

    function _checkIfMaxRefereeLimit(
        IdStruct memory _idAccount
    ) private view returns (bool isLimitReached) {
        // Check if the number of referees is equal to the maximum referee limit.
        if (
            _idAccount.refereeIds.length == _maxRefereeLimit ||
            _idAccount.refereeIds.length > _maxRefereeLimit
        ) {
            // If the limit is reached, set the boolean to true.
            isLimitReached = true;
        }
    }

    function _spillOver(
        IdStruct storage _firstReferrerIdAccount,
        IdStruct storage _userIdAccount
    ) private {
        uint256[] memory nonGlobalIds = _nonGlobalIds;

        require(
            nonGlobalIds.length > 0,
            "_addReferrer(): Global ids are over."
        );

        uint256 nonGlobalCount = _nonGlobalIdIncrement;

        for (uint256 i; i < nonGlobalIds.length; ++i) {
            IdStruct storage nonGlobalIdAccount = _mappingIds[
                nonGlobalIds[nonGlobalCount]
            ];

            if (_checkIfMaxRefereeLimit(nonGlobalIdAccount)) {
                _nonGlobalIdIncrement++;
                nonGlobalCount++;
                continue;
            }

            if (nonGlobalIdAccount.id == _userIdAccount.id) {
                nonGlobalCount++;
                continue;
            }

            _userIdAccount.referrerId = nonGlobalIdAccount.id;
            _firstReferrerIdAccount.refereeIds.push(
                RefereeStruct(_userIdAccount.id, nonGlobalIdAccount.id, 0)
            );

            nonGlobalIdAccount.refereeIds.push(
                RefereeStruct(_userIdAccount.id, 0, _firstReferrerIdAccount.id)
            );

            _pushIdToInitialPool(nonGlobalIdAccount);

            emit RefereeAssigned(
                _firstReferrerIdAccount.id,
                nonGlobalIdAccount.id,
                _userIdAccount.id
            );

            emit ReferrerUpdated(nonGlobalIdAccount.id, _userIdAccount.id);

            if (_checkIfMaxRefereeLimit(nonGlobalIdAccount) && i == 0) {
                _nonGlobalIdIncrement++;
            }

            break;
        }
    }

    function _addReferrer(
        IdStruct storage _firstReferrerIdAccount,
        IdStruct storage _userIdAccount
    ) private {
        uint256 userId = _userIdAccount.id;
        if (msg.sender != owner()) {
            require(
                _firstReferrerIdAccount.id != 0,
                "_addReferrer(): Referre Id is not activated or zero."
            );

            require(_firstReferrerIdAccount.owner != address(0));
        }

        require(
            _firstReferrerIdAccount.referrerId != userId,
            "_addReferrer(): Referee cannot be referrer upline."
        );

        require(
            _userIdAccount.referrerId == 0,
            "_addReferrer(): User referrer already set."
        );

        require(
            _firstReferrerIdAccount.id != userId,
            "_addReferrer(): Referrer and User Id can't be same."
        );

        _userIdAccount.parentId = _firstReferrerIdAccount.id;

        if (!_checkIfMaxRefereeLimit(_firstReferrerIdAccount)) {
            _userIdAccount.referrerId = _firstReferrerIdAccount.id;
            _firstReferrerIdAccount.refereeIds.push(
                RefereeStruct(userId, 0, 0)
            );

            _pushIdToInitialPool(_firstReferrerIdAccount);

            emit ReferrerUpdated(_firstReferrerIdAccount.id, userId);
        } else {
            _spillOver(_firstReferrerIdAccount, _userIdAccount);
        }

        uint256 levelsToCount = _teamLevelsToCount;

        for (uint256 i; i < levelsToCount; ++i) {
            IdStruct storage referrerIdAccount = _mappingIds[
                _userIdAccount.referrerId
            ];

            if (_userIdAccount.referrerId == 0) {
                break;
            }

            referrerIdAccount.team.push(TeamStruct(userId, i + 1));
            emit TeamUpdated(referrerIdAccount.id, userId);

            _userIdAccount = referrerIdAccount;
        }
    }

    function _payDirectReferral(
        IdStruct storage _userIdAccount,
        uint256 _valueInWei,
        address _tokenAddress,
        uint256 _adminTax
    ) private {
        _userIdAccount.business.selfBusiness += _valueInWei;
        emit SelfBusinessUpdated(_userIdAccount.id, _valueInWei);

        IdStruct storage referrerIdAccount;

        referrerIdAccount = _mappingIds[_userIdAccount.parentId];

        referrerIdAccount.business.directBusiness += _valueInWei;

        emit DirectBusinessUpdated(
            referrerIdAccount.id,
            _userIdAccount.id,
            _valueInWei
        );

        // uint256[] memory levelRates = _levelRates;

        uint256 referralValue = (_valueInWei * _levelRates[0]) / 100;

        if (referrerIdAccount.owner != address(0)) {
            IERC20Upgradeable(_tokenAddress).transfer(
                referrerIdAccount.owner,
                _deductAdminFees(
                    _weiToTokens(referralValue, _tokenAddress),
                    _adminTax
                )
            );
        }

        emit ReferralDistributed(
            referrerIdAccount.id,
            _userIdAccount.id,
            referralValue,
            1
        );

        referrerIdAccount.rewards.referralRewards += referralValue;

        _totalReferralPaid += referralValue;

        // _upgradeIdToPool(_tokenAddress);

        // for (uint256 i; i < levelRates.length; ++i) {
        //     referrerIdAccount = _mappingIds[_userIdAccount.referrerId];

        //     if (i == 0) {
        //         // _pushIdToPool(referrerIdAccount);
        //     }

        //     uint256 referralValue = (_valueInWei * levelRates[i]) / 100;

        //     IERC20Upgradeable(_tokenAddress).transfer(
        //         referrerIdAccount.owner,
        //         _weiToTokens(referralValue, _tokenAddress)
        //     );

        //     emit ReferralDistributed(
        //         referrerIdAccount.id,
        //         userId,
        //         referralValue,
        //         i + 1
        //     );

        //     referralPaid += referralValue;

        //     referrerIdAccount.rewards.referralRewards += referralValue;

        //     referrerIdAccount.business.teamBusiness += _valueInWei;

        //     emit TeamBusinessUpdated(
        //         referrerIdAccount.id,
        //         userId,
        //         _valueInWei,
        //         i + 1
        //     );

        //     _userIdAccount = referrerIdAccount;
        // }

        // _upgradeIdToPool(_tokenAddress);

        // _totalReferralPaid += referralPaid;
    }

    function _chargeAdminTax(uint256 _valueRegistered) private {
        uint256 taxValue = (_valueRegistered * _taxPer) / 100;
        _totalTaxCollected += taxValue;
        _pendingTaxToWithdraw += taxValue;
    }

    function _register(
        uint256 _referrerId,
        address _userAddress,
        address _tokenAddress,
        uint256 _adminTax
    ) private {
        address msgSender = msg.sender;
        uint256 valueInWei = _registrationAmountInUSD;

        if (_mappingSupportedToken[_tokenAddress].isEnaled) {
            IERC20Upgradeable(_tokenAddress).transferFrom(
                msgSender,
                address(this),
                _weiToTokens(valueInWei, _tokenAddress)
            );
        } else {
            revert("register(): Base Currency is not supported or enabled.");
        }

        IdStruct storage referrerIdAccount = _mappingIds[_referrerId];

        AccountStruct storage userAccount = _mappingAccounts[_userAddress];

        if (userAccount.ids.length == 0) {
            _users.push(msgSender);
        }

        _updateSelfAddress(userAccount, _userAddress);

        uint256 userId = _getNextId();

        IdStruct storage userIdAccount = _mappingIds[userId];

        _updateId(userIdAccount, userAccount);

        _pushIdToNonGlobal(userIdAccount);

        _addReferrer(referrerIdAccount, userIdAccount);

        _payDirectReferral(userIdAccount, valueInWei, _tokenAddress, _adminTax);

        _upgradeIdToPool(_tokenAddress, _adminTax);

        _totalValueRegistered += valueInWei;

        _chargeAdminTax(valueInWei);
    }

    function register(
        uint256 _referrerId,
        address _userAddress,
        address _tokenAddress
    ) external ReentrancyGuard {
        _register(_referrerId, _userAddress, _tokenAddress, _taxPer);
    }

    function registerBulk(
        uint8 _noOfIds,
        uint256 _referrerId,
        address _userAddress,
        address _tokenAddress
    ) external {
        uint256 taxPer = _taxPer;
        for (uint8 i; i < _noOfIds; ++i) {
            _register(_referrerId, _userAddress, _tokenAddress, taxPer);
        }
    }

    function getUserAccount(
        address _userAddress
    ) external view returns (AccountStruct memory) {
        return _mappingAccounts[_userAddress];
    }

    function getIdAccount(uint256 _id) external view returns (IdStruct memory) {
        return _mappingIds[_id];
    }

    function getContractAnalytics()
        external
        view
        returns (
            address[] memory usersAddress,
            uint256 usersCount,
            uint256 idsCount,
            uint256[] memory nonGlobalIds,
            uint256 nonGlobalIdsCount,
            uint256 totalReferralPaid,
            uint256 totalValueRegistered,
            uint256 totalTaxCollected,
            uint256 taxPendingToWithdraw
        )
    {
        usersAddress = _users;
        usersCount = _users.length;
        idsCount = _ids;
        nonGlobalIdsCount = _nonGlobalIds.length;
        nonGlobalIds = _nonGlobalIds;
        totalReferralPaid = _totalReferralPaid;
        totalValueRegistered = _totalValueRegistered;
        totalTaxCollected = _totalTaxCollected;
        taxPendingToWithdraw = _pendingTaxToWithdraw;
    }

    function getContractDefaults()
        external
        view
        returns (
            uint256[] memory levelRates,
            uint256 maxRefereeLimit,
            uint256 teamLevelsToCount,
            uint256 registrationAmountInUSD,
            address[] memory taxBeneficiaryAddress,
            uint256 taxPer,
            SupportedTokensStruct[] memory _supportedCurrency
        )
    {
        levelRates = _levelRates;
        maxRefereeLimit = _maxRefereeLimit;
        teamLevelsToCount = _teamLevelsToCount;
        registrationAmountInUSD = _registrationAmountInUSD;
        taxBeneficiaryAddress = _taxBeneficiaryAddresses;
        taxPer = _taxPer;
        _supportedCurrency = _supportedTokensList;
    }

    function claimPendingTax(address _tokenAddress) external {
        address[] memory taxBeneficiaryAddresses = _taxBeneficiaryAddresses;
        uint256 pendingTaxToWithdraw = _pendingTaxToWithdraw;
        uint256 pendingTaxShare = pendingTaxToWithdraw /
            taxBeneficiaryAddresses.length;

        for (uint8 i; i < taxBeneficiaryAddresses.length; ++i) {
            IERC20Upgradeable(_tokenAddress).transfer(
                taxBeneficiaryAddresses[i],
                _weiToTokens(pendingTaxShare, _tokenAddress)
            );
        }

        delete _pendingTaxToWithdraw;
    }

    function _deductAdminFees(
        uint256 _valueInWei,
        uint256 _adminFees
    ) private pure returns (uint256) {
        return (_valueInWei * (100 - _adminFees)) / 100;
    }

    /**
     * @dev Converts the given amount of ERC-20 tokens to wei, taking into account the token's decimal places.
     *
     * @param _valueInTokens The amount of tokens to be converted to wei.
     * @param _tokenAddress The address of the ERC-20 token.
     * @return tokensToWei The equivalent amount in wei.
     */
    function _tokensToWei(
        uint256 _valueInTokens,
        address _tokenAddress
    ) private view returns (uint256 tokensToWei) {
        // Calculate the value in wei by multiplying the token amount by 1 ether.
        uint256 valueInWei = _valueInTokens * 1 ether;

        // Adjust the value based on the decimal places of the ERC-20 token.
        tokensToWei =
            valueInWei /
            10 ** IERC20_EXTENDED(_tokenAddress).decimals();
    }

    /**
     * @dev Converts the given amount of wei to ERC-20 tokens, considering the token's decimal places.
     *
     * @param _valueInWei The amount in wei to be converted to tokens.
     * @param _tokenAddress The address of the ERC-20 token.
     * @return weiToTokens The equivalent amount in ERC-20 tokens.
     */
    function _weiToTokens(
        uint256 _valueInWei,
        address _tokenAddress
    ) private view returns (uint256 weiToTokens) {
        // Calculate the value in tokens by multiplying the wei amount by 10^decimal places of the ERC-20 token.
        weiToTokens =
            (_valueInWei * 10 ** IERC20_EXTENDED(_tokenAddress).decimals()) /
            1 ether;
    }

    /**
     * @dev Internal function to authorize an upgrade to a new implementation.
     *      Only the owner of the contract can authorize upgrades.
     *
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        // This function is empty as it only requires the owner's authorization for upgrades.
        // The 'onlyOwner' modifier ensures that only the owner can call this function.
        // No additional logic is implemented here as the authorization check is the main concern.
    }
}
