'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletInfo } from '@/components/WalletInfo';
import { CreateRedPacket } from '@/components/CreateRedPacket';
import { ClaimRedPacket } from '@/components/ClaimRedPacket';
import { DataTable } from '@/components/DataTable';
import { EventListener } from '@/components/EventListener';
import { Button } from '@/components/ui/Button';
import { 
  Gift, 
  PlusCircle, 
  Search, 
  BarChart3, 
  Activity,
  Rocket,
  Sparkles,
  Users
} from 'lucide-react';

type TabType = 'create' | 'claim' | 'data';
type DataViewType = 'all' | 'user' | 'claims' | 'activities';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [dataView, setDataView] = useState<DataViewType>('all');
  const [claimRedPacketId, setClaimRedPacketId] = useState('');

  const handleRedPacketCreated = (event: any) => {
    console.log('Red packet created:', event);
    // 可以在这里添加更多处理逻辑，比如自动切换到数据视图
  };

  const handleRedPacketClaimed = (event: any) => {
    console.log('Red packet claimed:', event);
    // 可以在这里添加更多处理逻辑
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 事件监听器 */}
      <EventListener 
        onRedPacketCreated={handleRedPacketCreated}
        onRedPacketClaimed={handleRedPacketClaimed}
      />

      {/* 顶部导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Gift className="w-8 h-8 text-red-500" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">链上红包</h1>
                <p className="text-xs text-gray-500">Web3 RedPacket System</p>
              </div>
            </div>

            {/* 钱包连接 */}
            <WalletInfo />
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎来到链上红包系统
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于区块链技术的去中心化红包系统，让分享变得更有趣、更透明、更安全
          </p>
        </div>

        {/* 功能导航标签 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              <Button
                onClick={() => setActiveTab('create')}
                variant={activeTab === 'create' ? 'default' : 'ghost'}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'create' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                发红包
              </Button>
              <Button
                onClick={() => setActiveTab('claim')}
                variant={activeTab === 'claim' ? 'default' : 'ghost'}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'claim' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                抢红包
              </Button>
              <Button
                onClick={() => setActiveTab('data')}
                variant={activeTab === 'data' ? 'default' : 'ghost'}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'data' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                数据统计
              </Button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="animate-fade-in">
          {activeTab === 'create' && (
            <div className="flex justify-center">
              <CreateRedPacket 
                onSuccess={(redPacketId) => {
                  console.log('红包创建成功，ID:', redPacketId);
                  setActiveTab('data');
                }}
              />
            </div>
          )}

          {activeTab === 'claim' && (
            <div className="max-w-md mx-auto space-y-6">
              {/* 红包ID输入 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-green-500" />
                  输入红包ID
                </h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={claimRedPacketId}
                    onChange={(e) => setClaimRedPacketId(e.target.value)}
                    placeholder="请输入红包ID（例如：1）"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Button
                    onClick={() => {
                      if (claimRedPacketId.trim()) {
                        // 输入验证会在ClaimRedPacket组件中进行
                      }
                    }}
                    disabled={!claimRedPacketId.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white px-6"
                  >
                    查看
                  </Button>
                </div>
              </div>

              {/* 红包详情 */}
              {claimRedPacketId.trim() && (
                <ClaimRedPacket 
                  redPacketId={claimRedPacketId.trim()}
                  onClaimed={() => {
                    console.log('红包领取成功');
                    setActiveTab('data');
                    setDataView('claims');
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* 数据视图切换 */}
              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-1 shadow-md border border-gray-200">
                  <div className="flex space-x-1">
                    <Button
                      onClick={() => setDataView('all')}
                      variant={dataView === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      className={dataView === 'all' ? 'bg-blue-500 text-white' : ''}
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      所有红包
                    </Button>
                    {isConnected && (
                      <>
                        <Button
                          onClick={() => setDataView('user')}
                          variant={dataView === 'user' ? 'default' : 'ghost'}
                          size="sm"
                          className={dataView === 'user' ? 'bg-purple-500 text-white' : ''}
                        >
                          我的红包
                        </Button>
                        <Button
                          onClick={() => setDataView('claims')}
                          variant={dataView === 'claims' ? 'default' : 'ghost'}
                          size="sm"
                          className={dataView === 'claims' ? 'bg-green-500 text-white' : ''}
                        >
                          我的领取
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => setDataView('activities')}
                      variant={dataView === 'activities' ? 'default' : 'ghost'}
                      size="sm"
                      className={dataView === 'activities' ? 'bg-orange-500 text-white' : ''}
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      最近活动
                    </Button>
                  </div>
                </div>
              </div>

              {/* 数据表格 */}
              <DataTable 
                view={dataView} 
                userAddress={address}
              />
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span>合约地址:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
              0x2bB8eaBb0B662E4fA333A9bF119017994194107E
            </code>
          </div>
          <p>
            基于以太坊区块链的去中心化红包系统 • 
            <a 
              href="https://github.com/limuran/blockchain-redpacket-system" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 ml-1"
            >
              查看源代码
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}