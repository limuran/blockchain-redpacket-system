// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract RedPackage {
    // 红包结构体
    struct RedPackageInfo {
        address payable creator;      // 红包创建者
        uint256 totalAmount;         // 红包总金额
        uint256 remainingAmount;     // 剩余金额
        uint256 totalCount;          // 红包总个数
        uint256 remainingCount;      // 剩余个数
        bool isEqual;                // 是否均等红包
        uint256 createTime;          // 创建时间
        bool isActive;               // 是否有效
        string message;              // 红包祝福语
    }
    
    // 抢红包记录
    struct GrabRecord {
        address grabber;             // 抢红包的人
        uint256 amount;              // 抢到的金额
        uint256 timestamp;           // 抢红包时间
    }
    
    // 存储所有红包信息
    mapping(uint256 => RedPackageInfo) public redPackages;
    // 每个红包的抢红包记录
    mapping(uint256 => GrabRecord[]) public grabRecords;
    // 用户在特定红包中是否已经抢过
    mapping(uint256 => mapping(address => bool)) public hasGrabbed;
    
    // 红包ID计数器
    uint256 public nextRedPackageId = 1;
    
    // 事件定义
    event RedPackageCreated(
        uint256 indexed redPackageId,
        address indexed creator,
        uint256 totalAmount,
        uint256 count,
        bool isEqual,
        string message
    );
    
    event RedPackageGrabbed(
        uint256 indexed redPackageId,
        address indexed grabber,
        uint256 amount,
        uint256 remainingCount,
        uint256 remainingAmount
    );
    
    event RedPackageCompleted(
        uint256 indexed redPackageId,
        address indexed creator,
        uint256 totalGrabbed
    );
    
    event RedPackageRefunded(
        uint256 indexed redPackageId,
        address indexed creator,
        uint256 refundAmount
    );
    
    // 创建红包
    function createRedPackage(
        uint256 _count, 
        bool _isEqual, 
        string memory _message
    ) public payable returns (uint256) {
        require(msg.value > 0, "Red package amount must be greater than 0");
        require(_count > 0, "Count must be greater than 0");
        require(_count <= 100, "Count cannot exceed 100"); // 限制红包数量
        require(bytes(_message).length <= 200, "Message too long"); // 限制消息长度
        
        uint256 redPackageId = nextRedPackageId++;
        
        redPackages[redPackageId] = RedPackageInfo({
            creator: payable(msg.sender),
            totalAmount: msg.value,
            remainingAmount: msg.value,
            totalCount: _count,
            remainingCount: _count,
            isEqual: _isEqual,
            createTime: block.timestamp,
            isActive: true,
            message: _message
        });
        
        emit RedPackageCreated(
            redPackageId,
            msg.sender,
            msg.value,
            _count,
            _isEqual,
            _message
        );
        
        return redPackageId;
    }
    
    // 抢红包
    function grabRedPackage(uint256 _redPackageId) public {
        RedPackageInfo storage redPackage = redPackages[_redPackageId];
        
        require(redPackage.isActive, "Red package does not exist or is inactive");
        require(redPackage.remainingCount > 0, "Red package is empty");
        require(!hasGrabbed[_redPackageId][msg.sender], "You have already grabbed this red package");
        require(msg.sender != redPackage.creator, "Creator cannot grab their own red package");
        
        uint256 grabAmount;
        
        if (redPackage.remainingCount == 1) {
            // 最后一个红包，获得所有剩余金额
            grabAmount = redPackage.remainingAmount;
        } else if (redPackage.isEqual) {
            // 均等红包
            grabAmount = redPackage.totalAmount / redPackage.totalCount;
        } else {
            // 随机红包 - 简化版随机算法
            uint256 maxAmount = (redPackage.remainingAmount * 2) / redPackage.remainingCount;
            if (maxAmount == 0) maxAmount = 1;
            
            grabAmount = (uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao, // 使用prevrandao替代已弃用的difficulty
                msg.sender,
                _redPackageId
            ))) % maxAmount) + 1;
            
            // 确保不超过剩余金额
            if (grabAmount > redPackage.remainingAmount) {
                grabAmount = redPackage.remainingAmount;
            }
        }
        
        // 更新状态
        redPackage.remainingAmount -= grabAmount;
        redPackage.remainingCount--;
        hasGrabbed[_redPackageId][msg.sender] = true;
        
        // 记录抢红包信息
        grabRecords[_redPackageId].push(GrabRecord({
            grabber: msg.sender,
            amount: grabAmount,
            timestamp: block.timestamp
        }));
        
        // 转账
        payable(msg.sender).transfer(grabAmount);
        
        // 发送事件
        emit RedPackageGrabbed(
            _redPackageId,
            msg.sender,
            grabAmount,
            redPackage.remainingCount,
            redPackage.remainingAmount
        );
        
        // 如果红包被抢完，发送完成事件
        if (redPackage.remainingCount == 0) {
            redPackage.isActive = false;
            emit RedPackageCompleted(_redPackageId, redPackage.creator, redPackage.totalAmount);
        }
    }
    
    // 获取红包信息
    function getRedPackageInfo(uint256 _redPackageId) public view returns (
        address creator,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 totalCount,
        uint256 remainingCount,
        bool isEqual,
        uint256 createTime,
        bool isActive,
        string memory message
    ) {
        RedPackageInfo memory redPackage = redPackages[_redPackageId];
        return (
            redPackage.creator,
            redPackage.totalAmount,
            redPackage.remainingAmount,
            redPackage.totalCount,
            redPackage.remainingCount,
            redPackage.isEqual,
            redPackage.createTime,
            redPackage.isActive,
            redPackage.message
        );
    }
    
    // 获取抢红包记录
    function getGrabRecords(uint256 _redPackageId) public view returns (GrabRecord[] memory) {
        return grabRecords[_redPackageId];
    }
    
    // 检查用户是否已经抢过红包
    function hasUserGrabbed(uint256 _redPackageId, address _user) public view returns (bool) {
        return hasGrabbed[_redPackageId][_user];
    }
    
    // 创建者可以回收未抢完的红包（24小时后）
    function refundRedPackage(uint256 _redPackageId) public {
        RedPackageInfo storage redPackage = redPackages[_redPackageId];
        
        require(redPackage.creator == msg.sender, "Only creator can refund");
        require(redPackage.isActive, "Red package is not active");
        require(block.timestamp >= redPackage.createTime + 24 hours, "Cannot refund within 24 hours");
        require(redPackage.remainingAmount > 0, "No remaining amount to refund");
        
        uint256 refundAmount = redPackage.remainingAmount;
        redPackage.remainingAmount = 0;
        redPackage.isActive = false;
        
        payable(msg.sender).transfer(refundAmount);
        
        emit RedPackageRefunded(_redPackageId, msg.sender, refundAmount);
    }
    
    // 获取合约余额
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
