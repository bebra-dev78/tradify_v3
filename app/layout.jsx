import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { Inter } from "next/font/google";
import Script from "next/script";

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
        <AppRouterCacheProvider>
          <AuthProvider>
            <ThemeRegistry>{children}</ThemeRegistry>
          </AuthProvider>
        </AppRouterCacheProvider>
        <Script id="metrika-counter" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(96496364, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
              });`}
        </Script>
        <NavigationEvents />
      </body>
    </html>
  );
}
