"use client";

import TabSecurity from "#/layout/Account/tab-security";
import TabProfile from "#/layout/Account/tab-profile";
import TabKeys from "#/layout/Account/tab-keys";

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
