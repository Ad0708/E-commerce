"use client";

import Loader from "@/components/common/Loader";
import Footer from "@/components/home/layout/HomeFooter";
import { Header } from "@/components/home/layout/HomeHeader";
import SupportChatBubble from "@/components/support/SupportChatBubble";
import { useStoreBasic } from "@/hooks/store/useStore";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: store, isLoading: storeLoading } = useStoreBasic();

  const storeName = store?.storeName || "";
  const logo = store?.logo || "";

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col dark:bg-slate-950">
        {storeLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader mode="container" />
          </div>
        ) : (
          <>
            <Header logo={logo} storeName={storeName} />
            {children}
            <SupportChatBubble />
            <Footer logo={logo} storeName={storeName} />
          </>
        )}
      </div>
    </>
  );
}
