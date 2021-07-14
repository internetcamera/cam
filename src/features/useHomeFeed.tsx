import { InternetCameraTypes } from '@internetcamera/sdk';
import { gql, request } from 'graphql-request';
import useSWR from 'swr';

const getHomeFeed = async (walletAddress: string) => {
  const { wallet } = await request<{
    wallet: {
      films: { film: { id: string } }[];
      photosCreated: { film: { id: string } }[];
    };
  }>(
    'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
    gql`
      query getUserFilm($walletAddress: String!) {
        wallet(id: $walletAddress) {
          films(where: { amount_gt: 0 }) {
            film {
              id
            }
          }
          photosCreated {
            film {
              id
            }
          }
        }
      }
    `,
    { walletAddress: walletAddress.toLowerCase() }
  );
  const { photos } = await request<{ photos: InternetCameraTypes.Photo[] }>(
    'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
    gql`
      query getRecentPhotosFromFilms($filmIds: [String]!) {
        photos(
          first: 100
          orderBy: createdAt
          orderDirection: desc
          where: { film_in: $filmIds }
        ) {
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
          film {
            id
            name
            symbol
            totalSupply
          }
        }
      }
    `,
    {
      filmIds: [
        ...wallet.films.map(n => n.film.id),
        ...wallet.photosCreated.map(n => n.film.id)
      ]
    }
  );
  return photos;
};

const useHomeFeed = (walletAddress?: string) => {
  const {
    data,
    error,
    mutate: refresh
  } = useSWR(walletAddress ? [walletAddress, 'feed-home'] : null, getHomeFeed, {
    refreshInterval: 0,
    dedupingInterval: 60 * 1000
  });
  return { data, error, loading: !data && !error, refresh };
};

export default useHomeFeed;
