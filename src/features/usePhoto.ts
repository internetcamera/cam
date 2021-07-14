import { useQuery } from '@internetcamera/sdk/dist/react';
import { Photo } from '@internetcamera/sdk/dist/types';
import { gql } from 'graphql-request';

const usePhoto = (
  tokenId: string
): {
  data?: Photo;
  error: any;
  refresh: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
} => {
  const { data, error, refresh } = useQuery(
    gql`
      query getPhoto($id: BigInt!) {
        photo(id: $id) {
          id
          name
          filmIndex
          image
          width
          height
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
          createdAt
        }
      }
    `,
    { id: tokenId }
  );
  return { data: data?.photo, error, refresh };
};

export default usePhoto;
