import { Photo } from '@internetcamera/sdk/dist/types';
import request, { gql } from 'graphql-request';
import useSWR from 'swr';

const getPhotosInWallet = async (address: string) => {
  const { wallet } = await request<{
    wallet: {
      photosOwned: Photo[];
    };
  }>(
    'https://api.thegraph.com/subgraphs/name/shahruz/ic-mumbai-one',
    gql`
      query getWalletPhotos($walletAddress: String!) {
        wallet(id: $walletAddress) {
          photosOwned {
            id
            name
            image
            width
            height
            filmIndex
            film {
              id
              name
              symbol
              used
              totalSupply
            }
          }
        }
      }
    `,
    { walletAddress: address.toLowerCase() }
  );
  return wallet.photosOwned;
};

const usePhotosInWallet = (address?: string) => {
  const {
    data,
    error,
    mutate: refresh
  } = useSWR(
    address ? [address, 'usePhotosInWallet'] : null,
    getPhotosInWallet,
    {
      refreshInterval: 0,
      dedupingInterval: 60 * 1000
    }
  );
  return { data, error, refresh };
};

export default usePhotosInWallet;
