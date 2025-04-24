export const cryptoIcons = {
  BTC: "/icons/btc-bitcoin.png",  // Ruta desde public/
  ETH: "/icons/eth-ethereum.png",
  USDT: "/icons/usdt-tether.png",
} as const;

export type CryptoIconKey = keyof typeof cryptoIcons;