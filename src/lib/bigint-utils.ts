// src/lib/bigint-utils.ts

/**
 * 安全的BigInt转换函数
 */
export function safeBigInt(value: string | number | bigint | undefined | null): bigint {
  if (value === undefined || value === null) {
    return 0n;
  }
  
  if (typeof value === 'bigint') {
    return value;
  }
  
  try {
    // 处理字符串和数字
    const strValue = String(value).trim();
    
    // 处理空字符串
    if (!strValue || strValue === '') {
      return 0n;
    }
    
    // 处理小数：先转为数字，然后取整数部分
    const numValue = parseFloat(strValue);
    if (!isFinite(numValue) || numValue < 0) {
      console.warn('Invalid value for BigInt conversion:', value);
      return 0n;
    }
    
    return BigInt(Math.floor(numValue));
  } catch (error) {
    console.error('BigInt conversion error:', error, 'value:', value);
    return 0n;
  }
}

/**
 * 安全的数字转换函数
 */
export function safeNumber(value: bigint | string | number | undefined | null): number {
  if (value === undefined || value === null) {
    return 0;
  }
  
  if (typeof value === 'number') {
    return isFinite(value) ? value : 0;
  }
  
  try {
    const strValue = typeof value === 'bigint' ? value.toString() : String(value);
    const numValue = Number(strValue);
    return isFinite(numValue) ? numValue : 0;
  } catch (error) {
    console.error('Number conversion error:', error, 'value:', value);
    return 0;
  }
}

/**
 * 格式化BigInt为Ether显示
 */
export function formatBigIntEther(value: bigint | string | number): string {
  try {
    const bigIntValue = typeof value === 'bigint' ? value : safeBigInt(value);
    
    // 将Wei转换为Ether (除以10^18)
    const etherValue = Number(bigIntValue) / Math.pow(10, 18);
    
    if (etherValue >= 1000000) {
      return `${(etherValue / 1000000).toFixed(2)}M`;
    }
    if (etherValue >= 1000) {
      return `${(etherValue / 1000).toFixed(2)}K`;
    }
    return etherValue.toFixed(4);
  } catch (error) {
    console.error('BigInt Ether formatting error:', error);
    return '0.0000';
  }
}

/**
 * 安全的BigInt比较
 */
export function compareBigInt(a: bigint, b: bigint | number | string): number {
  try {
    const aBigInt = typeof a === 'bigint' ? a : safeBigInt(a);
    const bBigInt = typeof b === 'bigint' ? b : safeBigInt(b);
    
    if (aBigInt > bBigInt) return 1;
    if (aBigInt < bBigInt) return -1;
    return 0;
  } catch (error) {
    console.error('BigInt comparison error:', error);
    return 0;
  }
}

/**
 * 检查BigInt是否为零或负数
 */
export function isBigIntZeroOrNegative(value: bigint): boolean {
  try {
    return value <= 0n;
  } catch (error) {
    console.error('BigInt zero check error:', error);
    return true;
  }
}

/**
 * 安全的BigInt减法（结果不会小于0）
 */
export function safeBigIntSubtract(a: bigint, b: bigint | number | string): bigint {
  try {
    const aBigInt = typeof a === 'bigint' ? a : safeBigInt(a);
    const bBigInt = typeof b === 'bigint' ? b : safeBigInt(b);
    
    const result = aBigInt - bBigInt;
    return result >= 0n ? result : 0n;
  } catch (error) {
    console.error('BigInt subtraction error:', error);
    return typeof a === 'bigint' ? a : 0n;
  }
}