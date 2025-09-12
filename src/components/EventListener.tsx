'use client'

import { useWatchContractEvent } from 'wagmi'
import { REDPACKET_CONTRACT_ADDRESS } from '@/config/wagmi'
import { REDPACKET_ABI } from '@/config/redpacket-abi'
import { formatEther } from 'viem'
import { formatAddress } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCallback, useRef } from 'react'

interface EventListenerProps {
  onRedPacketCreated?: (event: any) => void
  onRedPacketClaimed?: (event: any) => void
}

// 安全的 BigInt 转换函数
function safeBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') {
    return value
  }
  try {
    return BigInt(value.toString())
  } catch (error) {
    console.error('BigInt conversion error:', error)
    return BigInt(0)
  }
}

export function EventListener({
  onRedPacketCreated,
  onRedPacketClaimed
}: EventListenerProps) {
  // 防止重复处理同一个事件
  const processedEvents = useRef(new Set<string>())

  const handleRedPacketCreated = useCallback(
    (logs: any[]) => {
      logs.forEach((log) => {
        const eventId = `created-${log.transactionHash}-${log.logIndex}`
        if (processedEvents.current.has(eventId)) return
        processedEvents.current.add(eventId)

        const { creator, redPackageId, totalAmount, count, message } =
          log.args as any

        // 安全的类型转换
        const redPacketIdStr = redPackageId?.toString() || '0'
        const totalAmountStr = totalAmount?.toString() || '0'
        const countStr = count?.toString() || '0'

        toast.success(`新红包创建成功！ID: ${redPacketIdStr}`, {
          duration: 5000,
          icon: '🎉'
        })

        if (onRedPacketCreated) {
          onRedPacketCreated({
            creator,
            redPacketId: redPacketIdStr,
            totalAmount: formatEther(safeBigInt(totalAmountStr)),
            totalCount: countStr,
            message,
            timestamp: Date.now()
          })
        }
      })
    },
    [onRedPacketCreated]
  )

  const handleRedPacketGrabbed = useCallback(
    (logs: any[]) => {
      logs.forEach((log) => {
        const eventId = `grabbed-${log.transactionHash}-${log.logIndex}`
        if (processedEvents.current.has(eventId)) return
        processedEvents.current.add(eventId)

        const { redPackageId, grabber, amount } = log.args as any

        // 安全的类型转换
        const amountStr = amount?.toString() || '0'
        const redPacketIdStr = redPackageId?.toString() || '0'

        toast.success(
          `${formatAddress(grabber)} 领取了 ${formatEther(
            safeBigInt(amountStr)
          )} ETH`,
          {
            duration: 4000,
            icon: '💰'
          }
        )

        if (onRedPacketClaimed) {
          onRedPacketClaimed({
            redPacketId: redPacketIdStr,
            claimer: grabber,
            amount: formatEther(safeBigInt(amountStr)),
            timestamp: Date.now()
          })
        }
      })
    },
    [onRedPacketClaimed]
  )

  // 监听红包创建事件 - 优化配置
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageCreated',
    onLogs: handleRedPacketCreated,
    // 优化轮询间隔
    pollingInterval: 12000, // 12秒
    // 只监听最新区块的事件
    fromBlock: 'latest'
  })

  // 监听红包领取事件 - 优化配置
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageGrabbed',
    onLogs: handleRedPacketGrabbed,
    // 优化轮询间隔
    pollingInterval: 12000, // 12秒
    // 只监听最新区块的事件
    fromBlock: 'latest'
  })

  return null // 这个组件不渲染任何UI
}

// 自定义Hook用于监听特定红包的事件 - 按需使用（修复了BigInt问题）
export function useRedPacketEvents(
  redPacketId?: string,
  enabled: boolean = true
) {
  const processedEvents = useRef(new Set<string>())

  const handleGrabEvent = useCallback(
    (logs: any[]) => {
      if (!enabled) return

      logs.forEach((log) => {
        const eventId = `specific-${log.transactionHash}-${log.logIndex}`
        if (processedEvents.current.has(eventId)) return
        processedEvents.current.add(eventId)

        const { claimer, amount } = log.args as any

        // 安全的类型转换
        const amountStr = amount?.toString() || '0'

        // 显示实时领取通知
        toast(
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">
              <strong>{formatAddress(claimer)}</strong> 刚刚领取了{' '}
              <strong>{formatEther(safeBigInt(amountStr))} ETH</strong>
            </span>
          </div>,
          {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534'
            }
          }
        )
      })
    },
    [enabled]
  )

  // 构建监听参数 - 修复BigInt转换问题
  const watchArgs =
    redPacketId && enabled
      ? {
          redPackageId: safeBigInt(redPacketId)
        }
      : undefined

  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageGrabbed',
    args: watchArgs,
    onLogs: handleGrabEvent,
    enabled: enabled && !!redPacketId,
    pollingInterval: 15000, // 特定红包监听间隔可以稍长
    fromBlock: 'latest'
  })
}
