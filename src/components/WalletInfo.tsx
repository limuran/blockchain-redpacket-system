'use client';

import { useState, useEffect } from 'react';
import { useAccount, useEnsName, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, User, LogOut, Copy, Check } from 'lucide-react';

interface WalletInfoProps {
  className?: string;
}

export function WalletInfo({ className = '' }: WalletInfoProps) {
  const { address, isConnected, chain } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        连接钱包
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-red-500 text-base font-medium rounded-lg text-red-500 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        网络错误
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 8,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* 网络信息 */}
      <div className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-blue-800">
          {chain?.name || 'Unknown Network'}
        </span>
      </div>

      {/* 钱包地址 */}
      <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <User className="w-4 h-4 mr-2 text-gray-500" />
        <div className="flex flex-col">
          {ensName && (
            <span className="text-sm font-medium text-gray-900">{ensName}</span>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-mono">
              {address ? formatAddress(address) : ''}
            </span>
            <button
              onClick={handleCopyAddress}
              className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
              title="复制地址"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 断开连接 */}
      <button
        onClick={() => disconnect()}
        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
        title="断开连接"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}