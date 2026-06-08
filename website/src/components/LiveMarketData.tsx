import { useEffect, useMemo, useState } from "react";
import { OCA_CONFIG } from "../config";

type Lang = "en" | "fr";

type DexToken = {
  address: string;
  name: string;
  symbol: string;
};

type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: DexToken;
  quoteToken: DexToken;
  priceNative?: string;
  priceUsd?: string;
  txns?: {
    h24?: {
      buys?: number;
      sells?: number;
    };
  };
  volume?: {
    h24?: number;
  };
  priceChange?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
};

type DexResponse = {
  schemaVersion: string;
  pairs: DexPair[] | null;
};

type LiveMarketDataProps = {
  lang: Lang;
};

const text = {
  en: {
    title: "OCA live market",
    subtitle:
      "Live OCA market data is powered by DEX Screener and the official PancakeSwap V2 pair.",
    price: "OCA price",
    priceBnb: "Price in BNB",
    liquidity: "Liquidity",
    fdv: "FDV",
    marketCap: "Market cap",
    volume24h: "24h volume",
    txns24h: "24h transactions",
    buys: "Buys",
    sells: "Sells",
    poolOca: "OCA in pool",
    poolBnb: "BNB in pool",
    pair: "Pair address",
    dex: "Open DEX Screener",
    pancake: "Trade on PancakeSwap",
    loading: "Loading live market data...",
    unavailable:
      "Live data is not available yet. DEX Screener may still be indexing the new pool.",
    chartTitle: "Live DEX Screener chart",
    updated: "Auto-refreshes every 20 seconds.",
  },
  fr: {
    title: "Marché OCA en direct",
    subtitle:
      "Les données du marché OCA viennent de DEX Screener et de la pair officielle PancakeSwap V2.",
    price: "Prix OCA",
    priceBnb: "Prix en BNB",
    liquidity: "Liquidité",
    fdv: "FDV",
    marketCap: "Market cap",
    volume24h: "Volume 24h",
    txns24h: "Transactions 24h",
    buys: "Achats",
    sells: "Ventes",
    poolOca: "OCA dans la pool",
    poolBnb: "BNB dans la pool",
    pair: "Adresse de la pair",
    dex: "Ouvrir DEX Screener",
    pancake: "Trader sur PancakeSwap",
    loading: "Chargement des données marché...",
    unavailable:
      "Les données ne sont pas encore disponibles. DEX Screener peut encore être en train d’indexer la nouvelle pool.",
    chartTitle: "Graphique DEX Screener en direct",
    updated: "Rafraîchissement automatique chaque 20 secondes.",
  },
};

function formatUsd(value?: number | string) {
  if (value === undefined || value === null || value === "") return "—";

  const numberValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(numberValue)) return "—";

  if (numberValue > 0 && numberValue < 0.0001) {
    return `$${numberValue.toFixed(10)}`;
  }

  if (numberValue < 1) {
    return `$${numberValue.toFixed(8)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numberValue);
}

function formatNumber(value?: number | string, maximumFractionDigits = 2) {
  if (value === undefined || value === null || value === "") return "—";

  const numberValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(numberValue)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(numberValue);
}

function formatCompact(value?: number) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function LiveMarketData({ lang }: LiveMarketDataProps) {
  const t = text[lang];
  const [pair, setPair] = useState<DexPair | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMarketData() {
    try {
      const response = await fetch(OCA_CONFIG.dexScreenerApiUrl, {
        cache: "no-store",
      });

      const data = (await response.json()) as DexResponse;
      const firstPair = data.pairs?.[0] ?? null;

      setPair(firstPair);
    } catch (error) {
      console.error("Failed to load DEX Screener data:", error);
      setPair(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarketData();

    const interval = window.setInterval(() => {
      loadMarketData();
    }, 20_000);

    return () => window.clearInterval(interval);
  }, []);

  const poolData = useMemo(() => {
    if (!pair?.liquidity) {
      return {
        ocaAmount: "—",
        bnbAmount: "—",
      };
    }

    const baseSymbol = pair.baseToken.symbol?.toUpperCase();
    const quoteSymbol = pair.quoteToken.symbol?.toUpperCase();

    const baseAmount = pair.liquidity.base;
    const quoteAmount = pair.liquidity.quote;

    if (baseSymbol === "OCA") {
      return {
        ocaAmount: formatNumber(baseAmount, 2),
        bnbAmount: `${formatNumber(quoteAmount, 6)} ${quoteSymbol}`,
      };
    }

    if (quoteSymbol === "OCA") {
      return {
        ocaAmount: formatNumber(quoteAmount, 2),
        bnbAmount: `${formatNumber(baseAmount, 6)} ${baseSymbol}`,
      };
    }

    return {
      ocaAmount: `${formatNumber(baseAmount, 2)} ${baseSymbol}`,
      bnbAmount: `${formatNumber(quoteAmount, 6)} ${quoteSymbol}`,
    };
  }, [pair]);

  const totalTxns24h =
    (pair?.txns?.h24?.buys ?? 0) + (pair?.txns?.h24?.sells ?? 0);

  return (
    <section className="section liveMarketData" id="market-data">
      <div className="sectionHeader">
        
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="marketNotice">{t.loading}</div>
      ) : !pair ? (
        <div className="marketNotice">{t.unavailable}</div>
      ) : (
        <>
          <div className="marketStatsGrid">
            <div className="marketStatCard primary">
              <span>{t.price}</span>
              <strong>{formatUsd(pair.priceUsd)}</strong>
              <small>
                {pair.priceChange?.h24 !== undefined
                  ? `${pair.priceChange.h24.toFixed(2)}% / 24h`
                  : "—"}
              </small>
            </div>

            <div className="marketStatCard">
              <span>{t.priceBnb}</span>
              <strong>{pair.priceNative ?? "—"}</strong>
              <small>BNB per OCA</small>
            </div>

            <div className="marketStatCard">
              <span>{t.liquidity}</span>
              <strong>{formatUsd(pair.liquidity?.usd)}</strong>
              <small>PancakeSwap V2</small>
            </div>

            <div className="marketStatCard">
              <span>{t.fdv}</span>
              <strong>{formatUsd(pair.fdv)}</strong>
              <small>Fully diluted valuation</small>
            </div>

            <div className="marketStatCard">
              <span>{t.marketCap}</span>
              <strong>{pair.marketCap ? formatUsd(pair.marketCap) : "—"}</strong>
              <small>DEX Screener estimate</small>
            </div>

            <div className="marketStatCard">
              <span>{t.volume24h}</span>
              <strong>{formatUsd(pair.volume?.h24)}</strong>
              <small>Last 24 hours</small>
            </div>

            <div className="marketStatCard">
              <span>{t.txns24h}</span>
              <strong>{formatCompact(totalTxns24h)}</strong>
              <small>
                {t.buys}: {pair.txns?.h24?.buys ?? 0} / {t.sells}:{" "}
                {pair.txns?.h24?.sells ?? 0}
              </small>
            </div>

            <div className="marketStatCard">
              <span>{t.poolOca}</span>
              <strong>{poolData.ocaAmount}</strong>
              <small>OCA reserve</small>
            </div>

            <div className="marketStatCard">
              <span>{t.poolBnb}</span>
              <strong>{poolData.bnbAmount}</strong>
              <small>BNB reserve</small>
            </div>
          </div>

          <div className="pairBox">
            <span>{t.pair}</span>
            <code>{OCA_CONFIG.pancakePairAddress}</code>
          </div>

          <div className="marketActions">
            <a
              className="btn primary"
              href={OCA_CONFIG.pancakeSwapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.pancake}
            </a>

            <a
              className="btn ghost"
              href={OCA_CONFIG.dexScreenerUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.dex}
            </a>
          </div>
        </>
      )}

      <div className="dexChartCard">
        <div className="dexChartHeader">
          <div>
            <span>{t.chartTitle}</span>
            <p>{t.updated}</p>
          </div>
          <a href={OCA_CONFIG.dexScreenerUrl} target="_blank" rel="noreferrer">
            DEX Screener
          </a>
        </div>

        <iframe
          className="dexChartFrame"
          title="OCA Token DEX Screener chart"
          src={OCA_CONFIG.dexScreenerEmbedUrl}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </section>
  );
}