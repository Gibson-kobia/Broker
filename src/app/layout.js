import "./globals.css";

export const metadata = {
  title: "Nexara — One control layer. All your platforms.",
  description: "Unify your balances and route liquidity. Execute across exchanges, Web3 wallets, and bank rails from a single, seamless dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0c]">{children}</body>
    </html>
  );
}

