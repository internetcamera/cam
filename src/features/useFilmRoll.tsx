import { Film } from '@internetcamera/sdk/dist/types';
import { gql, request } from 'graphql-request';
import useSWR from 'swr';

const useFilmRoll = (filmAddress?: string) => {
  const {
    data,
    error,
    mutate: refresh
  } = useSWR<{ film: Film }>(
    filmAddress
      ? [
          gql`
            query getFilmRoll($filmAddress: String!) {
              film(id: $filmAddress) {
                id
                name
                description
                symbol
                totalSupply
                factoryModel
                used
                filmAddress
                wallets(where: { amount_gte: 1 }) {
                  id
                  amount
                  wallet {
                    id
                  }
                }
                photos(first: 100, orderBy: createdAt, orderDirection: desc) {
                  id
                  name
                  filmIndex
                  image
                  width
                  height
                  createdAt
                  creator {
                    address
                  }
                  owner {
                    address
                  }
                }
              }
            }
          `,
          filmAddress
        ]
      : null,
    (query: string) =>
      request(
        'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
        query,
        { filmAddress }
      )
  );
  return { data: data?.film, error, refresh };
};

export default useFilmRoll;
