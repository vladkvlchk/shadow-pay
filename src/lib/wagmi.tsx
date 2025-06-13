// wagmiConfig.ts
import { createConfig, http } from 'wagmi'
import { Chain } from 'viem'
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// 1. Define custom chain
export const intmaxChain: Chain = {
  id: 11155111,
  name: 'MyCustomNet',
  nativeCurrency: {
    name: 'MyETH',
    symbol: 'mETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mycustom-rpc.example.com'],
    },
    public: {
      http: ['https://mycustom-rpc.example.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://explorer.example.com',
    },
  },
  testnet: true,
}

// 2. Set up transport using viem’s http()
export const wagmiConfig = createConfig({
  chains: [intmaxChain],
  transports: {
    [intmaxChain.id]: http('https://mycustom-rpc.example.com'),
  },
  ssr: true,
})
