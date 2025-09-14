'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'
import { parseEther } from 'viem'
import { Gift, Send, Loader2, Shuffle, Equal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { REDPACKET_CONTRACT_ADDRESS } from '@/config/wagmi'
import { REDPACKET_ABI } from '@/config/redpacket-abi'
import toast from 'react-hot-toast'

interface CreateRedPacketProps {
  onSuccess?: (redPacketId: string) => void
}

// 安全的BigInt转换
function safeBigInt(value: string | number): bigint {
  try {
    return BigInt(Math.floor(Number(value)))
  } catch (error) {
    console.error('BigInt conversion error:', error)
    return BigInt(0)
  }
}

export function CreateRedPacket({ onSuccess }: CreateRedPacketProps) {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    totalAmount: '',
    totalCount: '',
    message: '',
    isEqual: false
  })
  const [isCreating, setIsCreating] = useState(false)

  const { writeContract, data: hash, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  // 使用 useEffect 监听交易确认状态
  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success('红包创建成功！', { id: 'create-redpacket' })
      setIsCreating(false)
      setFormData({
        totalAmount: '',
        totalCount: '',
        message: '',
        isEqual: false
      })

      // 重置 writeContract 状态
      reset()

      if (onSuccess) {
        onSuccess(hash)
      }
    }
  }, [isConfirmed, hash, onSuccess, reset])

  // 使用 useEffect 处理错误
  useEffect(() => {
    if (error) {
      toast.error('交易失败: ' + error.message, { id: 'create-redpacket' })
      setIsCreating(false)
    }
  }, [error])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('请先连接钱包')
      return
    }

    if (!formData.totalAmount || !formData.totalCount || !formData.message) {
      toast.error('请填写所有必填项')
      return
    }

    const totalAmount = parseFloat(formData.totalAmount)
    const totalCount = parseInt(formData.totalCount)

    if (totalAmount <= 0) {
      toast.error('红包总金额必须大于0')
      return
    }

    if (totalCount <= 0 || totalCount > 100) {
      toast.error('红包数量必须在1-100之间')
      return
    }

    if (totalAmount < 0.001) {
      toast.error('红包总金额不能少于0.001 ETH')
      return
    }

    try {
      setIsCreating(true)

      // 安全的BigInt转换
      const countBigInt = safeBigInt(totalCount)

      writeContract({
        address: REDPACKET_CONTRACT_ADDRESS,
        abi: REDPACKET_ABI,
        functionName: 'createRedPackage',
        args: [countBigInt, formData.isEqual, formData.message],
        value: parseEther(formData.totalAmount)
      })

      toast.loading('创建红包中...', { id: 'create-redpacket' })
    } catch (err) {
      console.error('创建红包失败:', err)
      toast.error('创建红包失败')
      setIsCreating(false)
    }
  }

  const averageAmount =
    formData.totalAmount && formData.totalCount
      ? (
          parseFloat(formData.totalAmount) / parseInt(formData.totalCount)
        ).toFixed(4)
      : '0'

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* 头部 */}
      <div className="redpacket-card p-6 text-white text-center">
        <Gift className="w-12 h-12 mx-auto mb-3 animate-bounce-subtle" />
        <h2 className="text-2xl font-bold mb-2">发送红包</h2>
        <p className="text-red-100 text-sm">分享你的祝福给朋友们</p>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 红包总金额 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            红包总金额 (ETH) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              placeholder="0.01"
              step="0.001"
              min="0.001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">ETH</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">最小金额: 0.001 ETH</p>
        </div>

        {/* 红包数量 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            红包数量 *
          </label>
          <input
            type="number"
            name="totalCount"
            value={formData.totalCount}
            onChange={handleInputChange}
            placeholder="10"
            min="1"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500">最多可发送100个红包</p>
        </div>

        {/* 红包类型选择 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            红包类型 *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
                !formData.isEqual
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="isEqual"
                checked={!formData.isEqual}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isEqual: false }))
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <Shuffle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-gray-900">随机红包</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">金额随机，增加惊喜</p>
            </label>

            <label
              className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
                formData.isEqual
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="isEqual"
                checked={formData.isEqual}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isEqual: true }))
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <Equal className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">均等红包</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">金额相等，公平分配</p>
            </label>
          </div>
        </div>

        {/* 平均金额显示 */}
        {formData.totalAmount && formData.totalCount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">
                {formData.isEqual ? '每个红包' : '平均每个红包'}:
              </span>{' '}
              {averageAmount} ETH
            </p>
          </div>
        )}

        {/* 祝福消息 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            祝福消息 *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="恭喜发财，大吉大利！"
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
          <p className="text-xs text-gray-500 text-right">
            {formData.message.length}/200
          </p>
        </div>

        {/* 提交按钮 */}
        <Button
          type="submit"
          disabled={!isConnected || isCreating || isConfirming}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
        >
          {isCreating || isConfirming ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isConfirming ? '确认中...' : '创建中...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              发送红包
            </>
          )}
        </Button>

        {/* 连接钱包提示 */}
        {!isConnected && (
          <div className="text-center text-sm text-gray-500 mt-4">
            请先连接钱包以发送红包
          </div>
        )}
      </form>
    </div>
  )
}
