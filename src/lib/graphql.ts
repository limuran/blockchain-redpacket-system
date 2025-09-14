import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { SUBGRAPH_URL } from '@/config/wagmi';

// 创建Apollo客户端
export const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

// GraphQL查询定义
export const GET_REDPACKETS = gql`
  query GetRedPackets($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String) {
    redPackageEntities(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      creator {
        id
        address
      }
      totalAmount
      remainingAmount
      totalCount
      remainingCount
      isEqual
      createTime
      isActive
      message
      blockNumber
      transactionHash
      grabRecords {
        id
        grabber {
          id
          address
        }
        amount
        timestamp
      }
    }
  }
`;

export const GET_REDPACKET_BY_ID = gql`
  query GetRedPacketById($id: ID!) {
    redPackageEntity(id: $id) {
      id
      creator {
        id
        address
      }
      totalAmount
      remainingAmount
      totalCount
      remainingCount
      isEqual
      createTime
      isActive
      message
      blockNumber
      transactionHash
      grabRecords {
        id
        grabber {
          id
          address
        }
        amount
        timestamp
      }
    }
  }
`;

export const GET_USER_REDPACKETS = gql`
  query GetUserRedPackets($creator: String!, $first: Int!, $skip: Int!) {
    redPackageEntities(
      where: { creator: $creator }
      first: $first
      skip: $skip
      orderBy: createTime
      orderDirection: desc
    ) {
      id
      creator {
        id
        address
      }
      totalAmount
      remainingAmount
      totalCount
      remainingCount
      isEqual
      createTime
      isActive
      message
      blockNumber
      transactionHash
    }
  }
`;

export const GET_USER_CLAIMS = gql`
  query GetUserClaims($grabber: String!, $first: Int!, $skip: Int!) {
    grabRecords(
      where: { grabber: $grabber }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      redPackage {
        id
        creator {
          id
          address
        }
        message
        totalAmount
      }
      grabber {
        id
        address
      }
      amount
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($first: Int!) {
    grabRecords(
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      redPackage {
        id
        creator {
          id
          address
        }
        message
        totalAmount
      }
      grabber {
        id
          address
      }
      amount
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

// 统计查询
export const GET_STATISTICS = gql`
  query GetStatistics {
    redPackageEntities(first: 1000) {
      id
      totalAmount
      totalCount
      remainingCount
      createTime
    }
    grabRecords(first: 1000) {
      id
      amount
      timestamp
    }
  }
`;

// 类型定义 - 匹配 schema 结构
export interface UserData {
  id: string;
  address: string;
}

export interface RedPacketData {
  id: string;
  creator: UserData;
  totalAmount: string;
  remainingAmount: string;
  totalCount: string;
  remainingCount: string;
  isEqual: boolean;
  createTime: string;
  isActive: boolean;
  message: string;
  blockNumber: string;
  transactionHash: string;
  grabRecords?: GrabRecordData[];
}

export interface GrabRecordData {
  id: string;
  redPackage?: RedPacketData;
  grabber: UserData;
  amount: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
}

export interface ActivityData {
  id: string;
  redPackage: RedPacketData;
  grabber: UserData;
  amount: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
}

// 为了向后兼容，也导出旧的接口名称（但使用新的数据结构）
export interface ClaimData extends GrabRecordData {}