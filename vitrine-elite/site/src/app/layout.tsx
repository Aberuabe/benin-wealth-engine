import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Vitrine d'Élite | Machines à Cash Automatisées",
  description: "Alliance brutale du Design, du Code et du Copywriting pour doubler vos conversions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="font-body bg-[#0C0A09] text-white min-h-full flex flex-col selection:bg-[#CA8A04] selection:text-black">
        {children}
      </body>
    </html>
  );
}
