import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export { alchemy };