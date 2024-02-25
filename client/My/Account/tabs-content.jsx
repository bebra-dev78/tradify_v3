"use client";

import TabSecurity from "#/client/My/Account/tab-security";
import TabProfile from "#/client/My/Account/tab-profile";
import TabKeys from "#/client/My/Account/tab-keys";

export default function TabsContent({
  value,
  loadingTrades,
  setLoadingTrades,
}) {
  switch (value) {
    case 0:
      return <TabProfile />;
    case 1:
      return (
        <TabKeys
          loadingTrades={loadingTrades}
          setLoadingTrades={setLoadingTrades}
        />
      );
    case 2:
      return <TabSecurity />;
    default:
      break;
  }
}
