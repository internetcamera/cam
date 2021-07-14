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

const getUserPhotosPosted = async (walletAddress: string) => {
  const { photos } = await request<{ photos: InternetCameraTypes.Photo[] }>(
    'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
    gql`
      query getRecentPhotosPostedFromUser($walletAddress: String!) {
        photos(
          first: 100
          orderBy: createdAt
          orderDirection: desc
          where: { creator: $walletAddress }
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
      walletAddress: walletAddress.toLowerCase()
    }
  );
  return photos;
};

const getUserPhotosOwned = async (walletAddress: string) => {
  const { photos } = await request<{ photos: InternetCameraTypes.Photo[] }>(
    'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
    gql`
      query getRecentPhotosOwnedFromUser($walletAddress: String!) {
        photos(
          first: 100
          orderBy: createdAt
          orderDirection: desc
          where: { owner: $walletAddress }
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
      walletAddress: walletAddress.toLowerCase()
    }
  );
  return photos;
};

const useFeed = (feed: string, walletAddress?: string) => {
  const {
    data,
    error,
    mutate: refresh
  } = useSWR(
    walletAddress ? [walletAddress, feed, 'use-feed'] : null,
    feed == 'home'
      ? getHomeFeed
      : feed == 'photos-posted'
      ? getUserPhotosPosted
      : feed == 'photos-owned'
      ? getUserPhotosOwned
      : null,
    {
      refreshInterval: 0,
      dedupingInterval: 60 * 1000
    }
  );
  return { data, error, loading: !data && !error, refresh };
};

export default useFeed;
