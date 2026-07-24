export interface MarketingData {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  timestamp: number;
}

const STORAGE_KEY = "marketing-data";
const EXPIRY_DAYS = 30;

const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export function saveMarketingData(
  marketing: Omit<MarketingData, "timestamp">,
) {
  const data: MarketingData = {
    ...marketing,
    timestamp: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMarketingData(): MarketingData | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    const data: MarketingData = JSON.parse(raw);

    if (Date.now() - data.timestamp > EXPIRY_MS) {
      clearMarketingData();
      return null;
    }

    return data;
  } catch {
    clearMarketingData();
    return null;
  }
}

export function clearMarketingData() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasMarketingData() {
  return !!getMarketingData();
}