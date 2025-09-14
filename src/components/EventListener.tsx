'use client'

import { useWatchContractEvent } from 'wagmi'
import { REDPACKET_CONTRACT_ADDRESS } from '@/config/wagmi'
import { REDPACKET_ABI } from '@/config/redpacket-abi'
import { formatEther } from 'viem'
import { formatAddress, formatEtherSafe, safeBigInt } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCallback, useRef } from 'react'

interface EventListenerProps {
  onRedPacketCreated?: (event: any) => void
  onRedPacketClaimed?: (event: any) => void
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

        try {
          const { creator, redPackageId, totalAmount, count, message } =
            log.args as any

          // 安全的类型转换
          const redPacketIdStr = redPackageId?.toString() || '0'
          const countStr = count?.toString() || '0'

          toast.success(`新红包创建成功！ID: ${redPacketIdStr}`, {
            duration: 5000,
            icon: '🎉'
          })

          if (onRedPacketCreated) {
            onRedPacketCreated({
              creator,
              redPacketId: redPacketIdStr,
              totalAmount: formatEtherSafe(totalAmount),
              totalCount: countStr,
              message,
              timestamp: Date.now()
            })
          }
        } catch (error) {
          console.error('Error handling RedPacketCreated event:', error)
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

        try {
          const { redPackageId, grabber, amount } = log.args as any

          const redPacketIdStr = redPackageId?.toString() || '0'

          toast.success(
            `${formatAddress(grabber)} 领取了 ${formatEtherSafe(amount)} ETH`,
            {
              duration: 4000,
              icon: '💰'
            }
          )

          if (onRedPacketClaimed) {
            onRedPacketClaimed({
              redPacketId: redPacketIdStr,
              claimer: grabber,
              amount: formatEtherSafe(amount),
              timestamp: Date.now()
            })
          }
        } catch (error) {
          console.error('Error handling RedPacketGrabbed event:', error)
        }
      })
    },
    [onRedPacketClaimed]
  )

  // 监听红包创建事件 - 修复：不使用 fromBlock
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageCreated',
    onLogs: handleRedPacketCreated,
    // 移除 fromBlock: 'latest'，让 wagmi 使用默认值
    poll: true,
    pollingInterval: 12_000
  })

  // 监听红包领取事件 - 修复：不使用 fromBlock
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageGrabbed',
    onLogs: handleRedPacketGrabbed,
    // 移除 fromBlock: 'latest'，让 wagmi 使用默认值
    poll: true,
    pollingInterval: 12_000
  })

  return null
}

// 修复的自定义Hook
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

        try {
          const { claimer, amount } = log.args as any

          toast(
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">
                <strong>{formatAddress(claimer)}</strong> 刚刚领取了{' '}
                <strong>{formatEtherSafe(amount)} ETH</strong>
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
        } catch (error) {
          console.error('Error handling specific grab event:', error)
        }
      })
    },
    [enabled]
  )

  // 构建安全的监听参数 - 确保 BigInt 类型正确
  const watchArgs =
    redPacketId && enabled
      ? {
          redPackageId: BigInt(redPacketId) // 直接使用 BigInt 构造函数
        }
      : undefined

  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPackageGrabbed',
    args: watchArgs,
    onLogs: handleGrabEvent,
    enabled: enabled && !!redPacketId,
    // 移除 fromBlock: 'latest'
    poll: true,
    pollingInterval: 15_000
  })
}
