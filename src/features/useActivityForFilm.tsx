import { TransferEvent } from '@internetcamera/sdk/dist/types';
import request, { gql } from 'graphql-request';
import useSWR from 'swr';

const useActivityForFilm = (address?: string) => {
  const {
    data,
    error,
    mutate: refresh
  } = useSWR<{ transferEvents: TransferEvent[] }>(
    address
      ? [
          gql`
            query getActivityForFilm($address: String!) {
              transferEvents(
                first: 100
                orderBy: createdAt
                orderDirection: desc
                where: { film: $address }
              ) {
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
            }
          `,
          address
        ]
      : null,
    (query: string) =>
      request(
        'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
        query,
        { address: address?.toLowerCase() }
      )
  );
  return { data, error, refresh };
};

export default useActivityForFilm;
