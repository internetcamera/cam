import { providers } from 'ethers';

const getJsonRpcProvider = () => {
  return new providers.JsonRpcProvider(
    `https://polygon-mumbai.infura.io/v3/31cab49b254143188fc112a0c332ad86`
  );
};

export default getJsonRpcProvider;
