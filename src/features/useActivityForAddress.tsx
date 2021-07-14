import { useQuery } from '@internetcamera/sdk/dist/react';
import { TransferEvent } from '@internetcamera/sdk/dist/types';
import { gql } from 'graphql-request';

const useActivityForAddress = (address?: string) => {
  const { data, refresh } = useQuery(
    address ? queryForAddress(address) : queryForGlobal()
  );
  const transferEvents: TransferEvent[] = data
    ? [data?.from, data?.to, data?.global]
        .filter(d => !!d)
        .flat()
        .sort((a, b) => b.createdAt - a.createdAt)
    : [];

  return { data: transferEvents, refresh };
};

const queryForAddress = (address: string) => gql`
{
  from: transferEvents(first:100, where: {from: "${address.toLowerCase()}"}, orderBy: createdAt, orderDirection: desc) {
    ...fields
  }
  to: transferEvents(first:100, where: {to: "${address.toLowerCase()}"}, orderBy: createdAt, orderDirection: desc) {
    ...fields
  }
}
fragment fields on TransferEvent {
  id
  type
  from {
    address
  }
  to {
    address
  }
  film {
    id
    name
    symbol
  }
  amount
  photo {
    id
    name
    image
    width
    height
    film {
      id
      name
      symbol
    }
  }
  txHash
  createdAt
}
`;

const queryForGlobal = () => gql`
  {
    global: transferEvents(
      first: 100
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...fields
    }
  }
  fragment fields on TransferEvent {
    id
    type
    from {
      address
    }
    to {
      address
    }
    film {
      id
      name
      symbol
    }
    amount
    photo {
      id
      name
      film {
        id
        name
        symbol
      }
    }
    txHash
    createdAt
  }
`;

export default useActivityForAddress;
