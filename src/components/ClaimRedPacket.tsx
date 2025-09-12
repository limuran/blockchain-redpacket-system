'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { Gift, Users, Clock, Coins, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { REDPACKET_CONTRACT_ADDRESS } from '@/config/wagmi';
import { REDPACKET_ABI } from '@/config/redpacket-abi';
import { formatAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

interface RedPacketInfo {
  creator: string;
  totalAmount: bigint;
  remainingAmount: bigint;
  totalCount: bigint;
  remainingCount: bigint;
  isEqual: boolean;
  createTime: bigint;
  isActive: boolean;
  message: string;
}

interface ClaimRedPacketProps {
  redPacketId: string;
  onClaimed?: () => void;
}

export function ClaimRedPacket({ redPacketId, onClaimed }: ClaimRedPacketProps) {
  const { address, isConnected } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState<number[]>([]);

  // 获取红包信息 - 修复函数名
  const { data: redPacketInfo, isLoading: isLoadingInfo, refetch: refetchInfo } = useReadContract({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    functionName: 'getRedPackageInfo', // 修正函数名
    args: [BigInt(redPacketId)],
  }) as { data: RedPacketInfo | undefined, isLoading: boolean, refetch: () => void };

  // 检查用户是否已领取 - 修复函数名
  const { data: hasGrabbed, refetch: refetchGrabbed } = useReadContract({
    address: REDPACKET_CONTRACT_ADDRESS,
    abi: REDPACKET_ABI,
    functionName: 'hasUserGrabbed', // 修正函数名
    args: [BigInt(redPacketId), address || '0x0'],
    enabled: !!address,
  }) as { data: boolean | undefined, refetch: () => void };

  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error('请先连接钱包');
      return;
    }

    if (!redPacketInfo?.isActive) {
      toast.error('红包已失效');
      return;
    }

    if (redPacketInfo.remainingCount <= BigInt(0)) {
      toast.error('红包已被抢完');
      return;
    }

    if (hasGrabbed) {
      toast.error('您已经领取过此红包');
      return;
    }

    try {
      setIsClaiming(true);
      
      writeContract({
        address: REDPACKET_CONTRACT_ADDRESS,
        abi: REDPACKET_ABI,
        functionName: 'grabRedPackage', // 修正函数名
        args: [BigInt(redPacketId)],
      });

      toast.loading('领取红包中...', { id: 'claim-redpacket' });
    } catch (err) {
      console.error('领取红包失败:', err);
      toast.error('领取红包失败');
      setIsClaiming(false);
    }
  };

  // 创建金币雨动画
  const createCoinRain = () => {
    const coins = Array.from({ length: 20 }, (_, i) => Date.now() + i);
    setCoinAnimation(coins);
    setTimeout(() => setCoinAnimation([]), 3000);
  };

  // 监听交易确认状态
  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success('红包领取成功！', { id: 'claim-redpacket' });
      setIsClaiming(false);
      createCoinRain();
      refetchInfo();
      refetchGrabbed();
      if (onClaimed) onClaimed();
    }
  }, [isConfirmed, hash, refetchInfo, refetchGrabbed, onClaimed]);

  useEffect(() => {
    if (error) {
      toast.error('交易失败: ' + error.message, { id: 'claim-redpacket' });
      setIsClaiming(false);
    }
  }, [error]);

  if (isLoadingInfo) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">加载红包信息中...</p>
      </div>
    );
  }

  if (!redPacketInfo) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">红包不存在</h3>
        <p className="text-gray-500">请检查红包ID是否正确</p>
      </div>
    );
  }

  // 修复BigInt运算
  const remainingCount = redPacketInfo.remainingCount;
  const totalCount = redPacketInfo.totalCount;
  const isFinished = remainingCount <= BigInt(0) || !redPacketInfo.isActive;
  
  // 安全的百分比计算
  const progress = totalCount > BigInt(0) 
    ? Number((totalCount - remainingCount) * BigInt(100) / totalCount)
    : 0;

  return (
    <div className="relative max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* 金币雨动画 */}
      {coinAnimation.map((coin, index) => (
        <div
          key={coin}
          className="coin-rain text-yellow-400"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.1}s`,
            fontSize: `${Math.random() * 10 + 20}px`,
          }}
        >
          <Coins />
        </div>
      ))}

      {/* 红包头部 */}
      <div className={`p-6 text-white text-center relative ${isFinished ? 'bg-gray-400' : 'redpacket-card redpacket-glow'}`}>
        <Gift className={`w-16 h-16 mx-auto mb-3 ${!isFinished && 'animate-bounce-subtle'}`} />
        <h2 className="text-2xl font-bold mb-2">
          {isFinished ? '红包已抢完' : '红包来了'}
        </h2>
        <p className="text-red-100 text-sm opacity-90">
          来自 {formatAddress(redPacketInfo.creator)}
        </p>
      </div>

      {/* 红包内容 */}
      <div className="p-6 space-y-4">
        {/* 祝福消息 */}
        <div className="text-center">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">
            "{redPacketInfo.message}"
          </p>
        </div>

        {/* 红包统计 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-5 h-5 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">总金额</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {Number(formatEther(redPacketInfo.totalAmount)).toFixed(4)} ETH
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600">红包数量</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {totalCount.toString()} 个
            </p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>已领取 {(totalCount - remainingCount).toString()}/{totalCount.toString()}</span>
            <span>{remainingCount.toString()} 个剩余</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* 红包类型显示 */}
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            redPacketInfo.isEqual 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {redPacketInfo.isEqual ? '均等红包' : '随机红包'}
          </span>
        </div>

        {/* 状态显示 */}
        <div className="text-center">
          {hasGrabbed ? (
            <div className="flex items-center justify-center text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">您已成功领取此红包</span>
            </div>
          ) : isFinished ? (
            <div className="flex items-center justify-center text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">红包已被抢完</span>
            </div>
          ) : (
            <Button
              onClick={handleClaim}
              disabled={!isConnected || isClaiming || isConfirming}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 text-lg rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
            >
              {isClaiming || isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isConfirming ? '确认中...' : '领取中...'}
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  立即领取
                </>
              )}
            </Button>
          )}
        </div>

        {/* 创建时间 */}
        <div className="flex items-center justify-center text-sm text-gray-500 pt-2">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            {new Date(Number(redPacketInfo.createTime) * 1000).toLocaleString('zh-CN')}
          </span>
        </div>

        {/* 连接钱包提示 */}
        {!isConnected && !hasGrabbed && !isFinished && (
          <div className="text-center text-sm text-gray-500 mt-4">
            请先连接钱包以领取红包
          </div>
        )}
      </div>
    </div>
  );
}