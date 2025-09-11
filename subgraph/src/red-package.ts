import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  RedPackageCreated,
  RedPackageGrabbed,
  RedPackageCompleted,
  RedPackageRefunded
} from "../generated/RedPackage/RedPackage"
import { 
  RedPackageEntity, 
  GrabRecord, 
  User, 
  RedPackageStats, 
  DailyRedPackageStats,
  RefundRecord 
} from "../generated/schema"

// 处理红包创建事件
export function handleRedPackageCreated(event: RedPackageCreated): void {
  log.info("Processing RedPackageCreated event for ID: {}", [event.params.redPackageId.toString()])

  // 创建红包实体
  let redPackage = new RedPackageEntity(event.params.redPackageId.toString())
  redPackage.creator = event.params.creator.toHex()
  redPackage.totalAmount = event.params.totalAmount
  redPackage.remainingAmount = event.params.totalAmount
  redPackage.totalCount = event.params.count
  redPackage.remainingCount = event.params.count
  redPackage.isEqual = event.params.isEqual
  redPackage.createTime = event.block.timestamp
  redPackage.isActive = true
  redPackage.message = event.params.message
  redPackage.blockNumber = event.block.number
  redPackage.transactionHash = event.transaction.hash

  redPackage.save()

  // 更新或创建用户
  let user = User.load(event.params.creator.toHex())
  if (user == null) {
    user = new User(event.params.creator.toHex())
    user.address = event.params.creator
    user.createdRedPackagesCount = BigInt.fromI32(0)
    user.grabbedRedPackagesCount = BigInt.fromI32(0)
    user.totalAmountCreated = BigInt.fromI32(0)
    user.totalAmountGrabbed = BigInt.fromI32(0)
    user.firstRedPackageTime = event.block.timestamp
    user.lastRedPackageTime = event.block.timestamp
  }

  user.createdRedPackagesCount = user.createdRedPackagesCount.plus(BigInt.fromI32(1))
  user.totalAmountCreated = user.totalAmountCreated.plus(event.params.totalAmount)
  user.lastRedPackageTime = event.block.timestamp

  user.save()

  // 更新全局统计
  updateGlobalStats(event.block.timestamp, true, false, event.params.totalAmount, BigInt.fromI32(0))

  // 更新每日统计
  updateDailyStats(event.block.timestamp, true, false, event.params.totalAmount, BigInt.fromI32(0), event.params.creator)
}

// 处理红包被抢事件
export function handleRedPackageGrabbed(event: RedPackageGrabbed): void {
  log.info("Processing RedPackageGrabbed event for ID: {} by {}", [
    event.params.redPackageId.toString(),
    event.params.grabber.toHex()
  ])

  // 更新红包实体
  let redPackage = RedPackageEntity.load(event.params.redPackageId.toString())
  if (redPackage != null) {
    redPackage.remainingAmount = event.params.remainingAmount
    redPackage.remainingCount = event.params.remainingCount
    redPackage.save()
  }

  // 创建抢红包记录
  let grabId = event.params.redPackageId.toString() + "-" + event.params.grabber.toHex() + "-" + event.block.timestamp.toString()
  let grabRecord = new GrabRecord(grabId)
  grabRecord.redPackage = event.params.redPackageId.toString()
  grabRecord.grabber = event.params.grabber.toHex()
  grabRecord.amount = event.params.amount
  grabRecord.timestamp = event.block.timestamp
  grabRecord.blockNumber = event.block.number
  grabRecord.transactionHash = event.transaction.hash

  grabRecord.save()

  // 更新抢红包用户
  let user = User.load(event.params.grabber.toHex())
  if (user == null) {
    user = new User(event.params.grabber.toHex())
    user.address = event.params.grabber
    user.createdRedPackagesCount = BigInt.fromI32(0)
    user.grabbedRedPackagesCount = BigInt.fromI32(0)
    user.totalAmountCreated = BigInt.fromI32(0)
    user.totalAmountGrabbed = BigInt.fromI32(0)
    user.firstRedPackageTime = event.block.timestamp
    user.lastRedPackageTime = event.block.timestamp
  }

  user.grabbedRedPackagesCount = user.grabbedRedPackagesCount.plus(BigInt.fromI32(1))
  user.totalAmountGrabbed = user.totalAmountGrabbed.plus(event.params.amount)
  user.lastRedPackageTime = event.block.timestamp

  user.save()

  // 更新全局统计
  updateGlobalStats(event.block.timestamp, false, true, BigInt.fromI32(0), event.params.amount)

  // 更新每日统计
  updateDailyStats(event.block.timestamp, false, true, BigInt.fromI32(0), event.params.amount, event.params.grabber)
}

// 处理红包完成事件
export function handleRedPackageCompleted(event: RedPackageCompleted): void {
  log.info("Processing RedPackageCompleted event for ID: {}", [event.params.redPackageId.toString()])

  // 更新红包状态
  let redPackage = RedPackageEntity.load(event.params.redPackageId.toString())
  if (redPackage != null) {
    redPackage.isActive = false
    redPackage.save()
  }
}

// 处理红包退款事件
export function handleRedPackageRefunded(event: RedPackageRefunded): void {
  log.info("Processing RedPackageRefunded event for ID: {}", [event.params.redPackageId.toString()])

  // 更新红包状态
  let redPackage = RedPackageEntity.load(event.params.redPackageId.toString())
  if (redPackage != null) {
    redPackage.isActive = false
    redPackage.save()
  }

  // 创建退款记录
  let refundId = event.params.redPackageId.toString() + "-refund"
  let refundRecord = new RefundRecord(refundId)
  refundRecord.redPackage = event.params.redPackageId.toString()
  refundRecord.creator = event.params.creator.toHex()
  refundRecord.refundAmount = event.params.refundAmount
  refundRecord.timestamp = event.block.timestamp
  refundRecord.blockNumber = event.block.number
  refundRecord.transactionHash = event.transaction.hash

  refundRecord.save()
}

// 更新全局统计
function updateGlobalStats(
  timestamp: BigInt,
  isCreated: boolean,
  isGrabbed: boolean,
  createdAmount: BigInt,
  grabbedAmount: BigInt
): void {
  let stats = RedPackageStats.load("global")
  if (stats == null) {
    stats = new RedPackageStats("global")
    stats.totalRedPackages = BigInt.fromI32(0)
    stats.totalUsers = BigInt.fromI32(0)
    stats.totalAmountDistributed = BigInt.fromI32(0)
    stats.totalGrabRecords = BigInt.fromI32(0)
    stats.equalRedPackagesCount = BigInt.fromI32(0)
    stats.randomRedPackagesCount = BigInt.fromI32(0)
  }

  if (isCreated) {
    stats.totalRedPackages = stats.totalRedPackages.plus(BigInt.fromI32(1))
    stats.totalAmountDistributed = stats.totalAmountDistributed.plus(createdAmount)
  }

  if (isGrabbed) {
    stats.totalGrabRecords = stats.totalGrabRecords.plus(BigInt.fromI32(1))
  }

  stats.lastUpdated = timestamp
  stats.save()
}

// 更新每日统计
function updateDailyStats(
  timestamp: BigInt,
  isCreated: boolean,
  isGrabbed: boolean,
  createdAmount: BigInt,
  grabbedAmount: BigInt,
  userAddress: Bytes
): void {
  // 生成日期字符串
  let dayTimestamp = timestamp.toI32() - (timestamp.toI32() % 86400)
  let dayId = dayTimestamp.toString()

  let dailyStats = DailyRedPackageStats.load(dayId)
  if (dailyStats == null) {
    dailyStats = new DailyRedPackageStats(dayId)
    dailyStats.date = dayId
    dailyStats.redPackagesCreated = BigInt.fromI32(0)
    dailyStats.totalAmountCreated = BigInt.fromI32(0)
    dailyStats.grabRecordsCount = BigInt.fromI32(0)
    dailyStats.totalAmountGrabbed = BigInt.fromI32(0)
    dailyStats.newUsers = BigInt.fromI32(0)
  }

  if (isCreated) {
    dailyStats.redPackagesCreated = dailyStats.redPackagesCreated.plus(BigInt.fromI32(1))
    dailyStats.totalAmountCreated = dailyStats.totalAmountCreated.plus(createdAmount)
  }

  if (isGrabbed) {
    dailyStats.grabRecordsCount = dailyStats.grabRecordsCount.plus(BigInt.fromI32(1))
    dailyStats.totalAmountGrabbed = dailyStats.totalAmountGrabbed.plus(grabbedAmount)
  }

  // 检查是否是新用户（简化版本 - 移除有问题的检查）
  let user = User.load(userAddress.toHex())
  if (user != null && user.firstRedPackageTime.equals(timestamp)) {
    dailyStats.newUsers = dailyStats.newUsers.plus(BigInt.fromI32(1))
  }

  dailyStats.save()
}
