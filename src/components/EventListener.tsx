'use client';

import { useWatchContractEvent } from 'wagmi';
import { REDPACKET_CONTRACT_ADDRESS } from '@/config/wagmi';
import { REDPACKET_ABI } from '@/config/redpacket-abi';
import { formatEther } from 'viem';
import { formatAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

interface EventListenerProps {
  onRedPacketCreated?: (event: any) => void;
  onRedPacketClaimed?: (event: any) => void;
}

export function EventListener({ onRedPacketCreated, onRedPacketClaimed }: EventListenerProps) {
  // 监听红包创建事件
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPacketCreated',
    onLogs(logs) {
      logs.forEach((log) => {
        const { creator, redPacketId, totalAmount, totalCount, message } = log.args as any;
        
        toast.success(
          `新红包创建成功！ID: ${redPacketId.toString()}`,
          {
            duration: 5000,
            icon: '🎉',
          }
        );

        if (onRedPacketCreated) {
          onRedPacketCreated({
            creator,
            redPacketId: redPacketId.toString(),
            totalAmount: formatEther(totalAmount),
            totalCount: totalCount.toString(),
            message,
            timestamp: Date.now(),
          });
        }
      });
    },
  });

  // 监听红包领取事件
  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPacketClaimed',
    onLogs(logs) {
      logs.forEach((log) => {
        const { redPacketId, claimer, amount } = log.args as any;
        
        toast.success(
          `${formatAddress(claimer)} 领取了 ${formatEther(amount)} ETH`,
          {
            duration: 4000,
            icon: '💰',
          }
        );

        if (onRedPacketClaimed) {
          onRedPacketClaimed({
            redPacketId: redPacketId.toString(),
            claimer,
            amount: formatEther(amount),
            timestamp: Date.now(),
          });
        }
      });
    },
  });

  return null; // 这个组件不渲染任何UI
}

// 自定义Hook用于监听特定红包的事件
export function useRedPacketEvents(redPacketId?: string) {
  const events: any[] = [];

  useWatchContractEvent({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    eventName: 'RedPacketClaimed',
    args: redPacketId ? { redPacketId: BigInt(redPacketId) } : undefined,
    onLogs(logs) {
      logs.forEach((log) => {
        const { claimer, amount } = log.args as any;
        
        // 显示实时领取通知
        toast(
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">
              <strong>{formatAddress(claimer)}</strong> 刚刚领取了 <strong>{formatEther(amount)} ETH</strong>
            </span>
          </div>,
          {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
            },
          }
        );
      });
    },
  });

  return events;
}