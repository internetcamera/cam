import useSWR from 'swr';
import { InternetCameraFilmFactory } from '@internetcamera/sdk';
import { formatEther } from '@ethersproject/units';
import useWallet from './useWallet';
import getJsonRpcProvider from './getJsonRpcProvider';

const useFilmFactoryTokenBalance = () => {
  const { account } = useWallet();
  const { data, error } = useSWR(
    account ? [account, 'use-film-factory-token-balance'] : null,
    async (account: string) => {
      const filmFactory = new InternetCameraFilmFactory({
        jsonRpcProvider: getJsonRpcProvider(),
        chainID: 80001
      });
      return await filmFactory.getFilmFactoryTokenBalanceOf(account);
    }
  );
  return {
    filmFactoryTokenBalance: data ? parseFloat(formatEther(data)) : 0,
    error
  };
};

export default useFilmFactoryTokenBalance;
