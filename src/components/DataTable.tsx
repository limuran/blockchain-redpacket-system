'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { formatEther } from 'viem'
import { Button } from '@/components/ui/Button'
import {
  GET_REDPACKETS,
  GET_USER_REDPACKETS,
  GET_USER_CLAIMS,
  GET_RECENT_ACTIVITIES,
  RedPacketData,
  GrabRecordData
} from '@/lib/graphql'
import { formatAddress, truncateText } from '@/lib/utils'
import {
  Gift,
  Users,
  Clock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface DataTableProps {
  view: 'all' | 'user' | 'claims' | 'activities'
  userAddress?: string
}

export function DataTable({ view, userAddress }: DataTableProps) {
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)

  // 根据视图类型选择查询
  const getQueryConfig = () => {
    const skip = page * pageSize

    switch (view) {
      case 'user':
        return {
          query: GET_USER_REDPACKETS,
          variables: {
            creator: userAddress?.toLowerCase() || '',
            first: pageSize,
            skip
          },
          enabled: !!userAddress
        }
      case 'claims':
        return {
          query: GET_USER_CLAIMS,
          variables: {
            grabber: userAddress?.toLowerCase() || '',
            first: pageSize,
            skip
          },
          enabled: !!userAddress
        }
      case 'activities':
        return {
          query: GET_RECENT_ACTIVITIES,
          variables: {
            first: pageSize
          },
          enabled: true
        }
      default:
        return {
          query: GET_REDPACKETS,
          variables: {
            first: pageSize,
            skip,
            orderBy: 'createTime',
            orderDirection: 'desc'
          },
          enabled: true
        }
    }
  }

  const queryConfig = getQueryConfig()
  const { data, loading, error, refetch } = useQuery(queryConfig.query, {
    variables: queryConfig.variables,
    skip: !queryConfig.enabled,
    pollInterval: 30000
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载数据中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">加载数据失败: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          重试
        </Button>
      </div>
    )
  }

  const getTableData = () => {
    if (!data) return []
    switch (view) {
      case 'user':
        return data.redPackageEntities || []
      case 'claims':
        return data.grabRecords || []
      case 'activities':
        return data.grabRecords || []
      default:
        return data.redPackageEntities || []
    }
  }

  const tableData = getTableData()
  const hasData = tableData.length > 0

  // 安全的BigInt处理函数
  const safeFormatEther = (value: string | bigint) => {
    try {
      const bigintValue = typeof value === 'string' ? BigInt(value) : value
      return Number(formatEther(bigintValue)).toFixed(4)
    } catch (error) {
      return '0.0000'
    }
  }

  const safeToNumber = (value: string | number | bigint) => {
    try {
      if (typeof value === 'bigint') return Number(value)
      if (typeof value === 'string') return parseInt(value, 10)
      return value
    } catch (error) {
      return 0
    }
  }

  const calculateProgress = (remaining: string, total: string) => {
    try {
      const remainingNum = safeToNumber(remaining)
      const totalNum = safeToNumber(total)
      const claimed = totalNum - remainingNum
      return totalNum > 0 ? (claimed / totalNum) * 100 : 0
    } catch (error) {
      return 0
    }
  }

  const getClaimedCount = (remaining: string, total: string) => {
    const remainingNum = safeToNumber(remaining)
    const totalNum = safeToNumber(total)
    return totalNum - remainingNum
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 表格头部 */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {view === 'all' && '所有红包'}
            {view === 'user' && '我的红包'}
            {view === 'claims' && '我的领取记录'}
            {view === 'activities' && '最近活动'}
          </h3>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* 表格内容 */}
      {!hasData ? (
        <div className="text-center py-12">
          <Gift className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">暂无数据</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {view === 'all' || view === 'user' ? (
                <>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        进度
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        消息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(tableData as RedPacketData[]).map((item) => {
                      const progress = calculateProgress(
                        item.remainingCount,
                        item.totalCount
                      )
                      const claimedCount = getClaimedCount(
                        item.remainingCount,
                        item.totalCount
                      )
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            #{item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {formatAddress(item.creator.address)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {safeFormatEther(item.totalAmount)} ETH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, progress)
                                    )}%`
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {claimedCount}/{safeToNumber(item.totalCount)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.isEqual
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {item.isEqual ? '等额' : '随机'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {truncateText(item.message, 30)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(
                                parseInt(item.createTime) * 1000
                              ).toLocaleDateString('zh-CN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.isActive ? '活跃' : '已结束'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </>
              ) : (
                <>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        红包ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {view === 'activities' ? '领取者' : '创建者'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        交易哈希
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(tableData as GrabRecordData[]).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          #{item.redPackage?.id || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {view === 'activities'
                            ? formatAddress(item.grabber.address)
                            : formatAddress(
                                item.redPackage?.creator.address || ''
                              )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          +{safeFormatEther(item.amount)} ETH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(
                              parseInt(item.timestamp) * 1000
                            ).toLocaleString('zh-CN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500 max-w-xs truncate">
                          {formatAddress(item.transactionHash, 8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>

          {/* 分页 */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              显示第 {page * pageSize + 1}-
              {Math.min(
                (page + 1) * pageSize,
                page * pageSize + tableData.length
              )}{' '}
              条
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500">第 {page + 1} 页</span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={tableData.length < pageSize}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
