import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WalletState = {
  account: string | null;
  wcUri?: string;
  app?: string;
  openApp?: (appName: string, urlSuffix?: string) => void;
  refreshManager?: () => void;
  disconnect?: () => void;
  signTypedData?: (data: string) => Promise<string>;
  pendingTransactions: Array<string>;
  addPendingTransaction: (txHash: string) => void;
  removePendingTransaction: (txHash: string) => void;
};

export const useWallet = create<WalletState>(
  persist(
    (set, get) => ({
      account: null,
      pendingTransactions: [],
      addPendingTransaction: (txHash: string) =>
        set({ pendingTransactions: [txHash, ...get().pendingTransactions] }),
      removePendingTransaction: (txHash: string) =>
        set({
          pendingTransactions: get().pendingTransactions.filter(
            tx => tx != txHash
          )
        })
    }),
    {
      name: 'wallet-internet-camera',
      getStorage: () => AsyncStorage
    }
  )
);

export default useWallet;
