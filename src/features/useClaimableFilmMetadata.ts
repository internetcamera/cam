import { ClaimableFilm } from '@internetcamera/sdk';
import { Film } from '@internetcamera/sdk/dist/types';
import { formatEther } from 'ethers/lib/utils';
import useSWR from 'swr';
import getJsonRpcProvider from './getJsonRpcProvider';

const getClaimableFilmMetadata = async (
  filmAddress: string,
  account?: string
) => {
  const film = new ClaimableFilm(filmAddress, {
    jsonRpcProvider: getJsonRpcProvider(),
    chainID: 80001
  });
  const contract = film.getContract();
  let [_amountClaimablePerUser, _maxClaimsPerUser, _claimCountOf, _balance] =
    await Promise.all([
      contract.amountClaimablePerUser(),
      contract.maxClaimsPerUser(),
      account ? contract.claimCountOf(account) : null,
      account ? contract.balanceOf(account) : null
    ]);
  const amountClaimablePerUser = parseFloat(
    formatEther(_amountClaimablePerUser)
  );
  const maxClaimsPerUser = _maxClaimsPerUser.toNumber();
  const claimCount = _claimCountOf ? _claimCountOf.toNumber() : 0;
  const balance = _balance ? parseFloat(formatEther(_balance)) : 0;
  return {
    amountClaimablePerUser,
    maxClaimsPerUser,
    claimCount,
    canClaim: claimCount < maxClaimsPerUser && balance < 1
  };
};

const useClaimableFilmMetadata = (film?: Film, account?: string | null) => {
  const { data, error, mutate } = useSWR(
    film?.factoryModel == 'claimable'
      ? [film.filmAddress || film.id, account]
      : null,
    getClaimableFilmMetadata
  );
  return { data, error, refresh: mutate };
};

export default useClaimableFilmMetadata;
