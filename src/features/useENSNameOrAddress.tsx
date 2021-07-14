import { InternetCameraAddresses } from '@internetcamera/sdk';
import { providers } from 'ethers';
import useSWR from 'swr';

const getENSName = async (account: string) => {
  if (
    account.toLowerCase() == InternetCameraAddresses[80001].camera.toLowerCase()
  )
    return 'Internet Camera';
  return new providers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/b95f6330bfdd4f5d8960db9d1d3da676',
    1
  ).lookupAddress(account);
};

const useENSNameOrAddress = (account?: string) => {
  const { data } = useSWR(account ? [account, 'ens'] : null, getENSName);
  return data ? data : account ? `${account.slice(0, 8)}` : '';
};

export default useENSNameOrAddress;
