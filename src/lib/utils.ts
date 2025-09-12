import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatEther } from 'viem';
import { safeBigInt, safeNumber } from './bigint-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars + 2) {
    return address || '';
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * 安全的Ether格式化函数
 */
export function formatEtherSafe(value: string | bigint | number | undefined | null): string {
  try {
    if (value === undefined || value === null) {
      return '0.0000';
    }
    
    // 如果是BigInt，直接使用viem的formatEther
    if (typeof value === 'bigint') {
      const formatted = formatEther(value);
      const num = parseFloat(formatted);
      
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(2)}K`;
      }
      return num.toFixed(4);
    }
    
    // 如果是字符串或数字，先转换为数字处理
    const num = safeNumber(value);
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(4);
  } catch (error) {
    console.error('formatEtherSafe error:', error, 'value:', value);
    return '0.0000';
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateRandomColors(): string[] {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors.sort(() => Math.random() - 0.5);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 重新导出BigInt工具函数以便于使用
export { safeBigInt, safeNumber, formatBigIntEther, compareBigInt, isBigIntZeroOrNegative } from './bigint-utils';