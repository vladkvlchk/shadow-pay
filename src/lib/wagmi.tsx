// wagmiConfig.ts
import { createConfig, http } from 'wagmi'
import { Chain } from 'viem'
import { base } from 'wagmi/chains'
import { sepolia } from "wagmi/chains";
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// 1. Define custom chain
export const intmaxChain: Chain = {
  id: 11155111,
  name: 'INTMAX',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-sepolia-rpc.publicnode.com'],
    },
    public: {
        http: ['https://ethereum-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'INTMAX Explorer',
      url: 'https://beta.testnet.explorer.intmax.io/',
    },
  },
  testnet: true,
}

// // 2. Set up transport using viem’s http()
// export const wagmiConfig = createConfig({
//   chains: [intmaxChain, base],
//   transports: {
//     [intmaxChain.id]: http('https://mycustom-rpc.example.com'),
//     [base.id]: http('')
//   },
//   ssr: true,
// })

export const wagmiConfig = getDefaultConfig({
    appName: "Web3 Chat",
    projectId: "YOUR_PROJECT_ID",
    chains: [sepolia],
    ssr: true,
});