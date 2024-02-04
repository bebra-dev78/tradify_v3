import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { Inter } from "next/font/google";

import NavigationEvents from "#/client/Global/navigation-events";
import ThemeRegistry from "#/client/Global/theme-registry";
import AuthProvider from "#/client/Global/auth-provider";

import "./globals.css";

export const metadata = {
  manifest: "/manifest.json",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#161C24",
};

const inter = Inter({ subsets: ["cyrillic"] });

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className} data-theme="dark">
        <NavigationEvents />
        <AuthProvider>
          <AppRouterCacheProvider>
            <ThemeRegistry>{children}</ThemeRegistry>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
