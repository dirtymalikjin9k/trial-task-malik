
"use client"
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultWallets,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { SiweMessage } from 'siwe';

const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
        const response = await fetch('/api/nonce');
        return await response.text();
    },

    createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
            chainId,
            nonce,
        });
    },

    getMessageBody: ({ message }) => {
        return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
        const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
        });

        return Boolean(verifyRes.ok);
    },

    signOut: async () => {
        await fetch('/api/logout');
    },
});


const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

export default function RainbowProvider({ children }: React.PropsWithChildren) {
    return <WagmiConfig config={wagmiConfig}>
        <SessionProvider>
            <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={'authenticated'}>
                <RainbowKitProvider chains={chains}>
                    {children}
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </SessionProvider>
    </WagmiConfig>
}