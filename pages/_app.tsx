import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { argentWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { NETWORK_RPC_URL } from '../constants';


const cantoChain: Chain = {
	id: 7_700,
	name: "Canto",
	network: "canto",
	nativeCurrency: {
		decimals: 18,
		name: "Canto",
		symbol: "CANTO",
	},
	rpcUrls: {
		public: {http: [NETWORK_RPC_URL]},
    default: {http: [NETWORK_RPC_URL]},
	},
	blockExplorers: {
		default: { name: "Canto Explorer", url: "https://tuber.build" },
	},
	testnet: false,
};

const { chains, provider } = configureChains(
	[ cantoChain ],
	[
		publicProvider(),
		jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    }),
	]
);


const { connectors } = getDefaultWallets({
  appName: 'drCanto Mint',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
