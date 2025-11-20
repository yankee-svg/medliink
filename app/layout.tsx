import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ReduxProvider } from "./store/provider";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Seo from "./components/Seo/Seo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Seo />
      <body className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Toaster />
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
