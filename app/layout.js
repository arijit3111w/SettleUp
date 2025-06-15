import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  title: "Settleup",
  description: "Settle Expenses with Friends smartly and easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/logo-fav.png" />
      </head>
      <body
        className={`${inter.classname}` }
      >
        <ClerkProvider>
        <ConvexClientProvider>
          <ThemeProvider>
        <Header/>
        <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
        
        {children}
        
        <Toaster richColors/>
        <Footer />
        </main>
        </div>
        </ThemeProvider>
        
        </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
