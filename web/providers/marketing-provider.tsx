"use client";

import { useEffect } from "react";
import {
  hasMarketingData,
  saveMarketingData,
} from "@/lib/utils/marketing";

export default function MarketingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }

      return null;
    };

    // Read marketing cookie created by proxy
    const marketingCookie = getCookie("marketing");

    if (marketingCookie) {
      try {
        const marketing = JSON.parse(
          decodeURIComponent(marketingCookie),
        );

        saveMarketingData({
          source: marketing.source || "Direct",
          medium: marketing.medium || "",
          campaign: marketing.campaign || "",
          referrer: document.referrer || "",
        });

        // Remove cookie after saving
        document.cookie =
          "marketing=; path=/; max-age=0";

        return;
      } catch (error) {
        console.error(
          "Marketing cookie parse error",
          error,
        );
      }
    }

    // Normal UTM capture (when page loads directly)
    const params = new URLSearchParams(
      window.location.search,
    );

    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");

    const referrer =
      document.referrer &&
      !document.referrer.startsWith(
        window.location.origin,
      )
        ? document.referrer
        : "";

    if (source || medium || campaign) {
      saveMarketingData({
        source: source || "Direct",
        medium: medium || "",
        campaign: campaign || "",
        referrer,
      });

      return;
    }

    if (!hasMarketingData()) {
      saveMarketingData({
        source: "Direct",
        medium: "",
        campaign: "",
        referrer,
      });
    }
  }, []);

  return <>{children}</>;
}