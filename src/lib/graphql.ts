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
    redPackets(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      creator
      totalAmount
      totalCount
      claimedCount
      message
      createdAt
      isActive
      claims {
        id
        claimer
        amount
        timestamp
      }
    }
  }
`;

export const GET_REDPACKET_BY_ID = gql`
  query GetRedPacketById($id: ID!) {
    redPacket(id: $id) {
      id
      creator
      totalAmount
      totalCount
      claimedCount
      message
      createdAt
      isActive
      claims {
        id
        claimer
        amount
        timestamp
      }
    }
  }
`;

export const GET_USER_REDPACKETS = gql`
  query GetUserRedPackets($creator: String!, $first: Int!, $skip: Int!) {
    redPackets(
      where: { creator: $creator }
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      creator
      totalAmount
      totalCount
      claimedCount
      message
      createdAt
      isActive
    }
  }
`;

export const GET_USER_CLAIMS = gql`
  query GetUserClaims($claimer: String!, $first: Int!, $skip: Int!) {
    claims(
      where: { claimer: $claimer }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      redPacket {
        id
        creator
        message
      }
      claimer
      amount
      timestamp
    }
  }
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($first: Int!) {
    claims(
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      redPacket {
        id
        creator
        message
        totalAmount
      }
      claimer
      amount
      timestamp
    }
  }
`;

// 统计查询
export const GET_STATISTICS = gql`
  query GetStatistics {
    redPackets(first: 1000) {
      id
      totalAmount
      totalCount
      claimedCount
      createdAt
    }
    claims(first: 1000) {
      id
      amount
      timestamp
    }
  }
`;

// 类型定义
export interface RedPacketData {
  id: string;
  creator: string;
  totalAmount: string;
  totalCount: string;
  claimedCount: string;
  message: string;
  createdAt: string;
  isActive: boolean;
  claims?: ClaimData[];
}

export interface ClaimData {
  id: string;
  claimer: string;
  amount: string;
  timestamp: string;
  redPacket?: {
    id: string;
    creator: string;
    message: string;
    totalAmount?: string;
  };
}

export interface ActivityData {
  id: string;
  redPacket: {
    id: string;
    creator: string;
    message: string;
    totalAmount: string;
  };
  claimer: string;
  amount: string;
  timestamp: string;
}