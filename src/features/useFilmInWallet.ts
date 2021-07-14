import { useQuery } from '@internetcamera/sdk/dist/react';
import { gql } from 'graphql-request';

const useFilmInWallet = (address: string) => {
  const { data, error, refresh } = useQuery(gql`
    {
      walletFilms(
        where: { wallet: "${address.toLowerCase()}", amount_gte: 1 }
      ) {
        id
        film {
          id
          name
          symbol
          totalSupply
          used
          factoryModel
          filmAddress
        }
        amount
      }
    }
  `);
  return { data: data?.walletFilms, error, refresh };
};

export default useFilmInWallet;
