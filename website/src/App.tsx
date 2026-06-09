import { useMemo, useState } from "react";
import "./App.css";
import { OCA_CONFIG } from "./config";
import LiveMarketData from "./components/LiveMarketData";

type Lang = "en" | "fr";

const text = {
  en: {
    navToken: "Token",
    navUtility: "Utility",
    navBuy: "How to buy",
    navMarket: "Market Data",
    navFaq: "FAQ",
    language: "FR",

    heroBadge: "Official OCA Token website",
    heroTitle: "OCA Token",
    heroSubtitle: "The utility token of the OCA Fintech ecosystem",
    heroText:
      "OCA Token is designed to connect the OCA Fintech ecosystem, including OCA Shop, OCA Price Analyzer, OCA Voice, OCA Markets and future OCA services.",
    viewContract: "View Contract",
    howToBuy: "BUY/SELL",
    explore: "Explore OCA Ecosystem",
    
    buyOnPancake: "Buy OCA on PancakeSwap",
    sellOnPancake: "Sell OCA on PancakeSwap",
    pairName: "Official pair: OCA/WBNB",
pairNote:
  "On PancakeSwap, BNB is represented as WBNB inside the liquidity pool. This is normal.",
  walletDisplayTitle: "Wallet display notice",
walletImportNote:
  "After buying, if OCA does not appear automatically in MetaMask or Trust Wallet, import it manually using the official OCA contract address.",

importantBeforeSelling: "Before selling, make sure you are using the official OCA/WBNB pair and review price impact, taxes and available liquidity.",

    statusContract: "Contract deployed",
    statusPool: "Liquidity pool created",
    statusTrading: "Trading live on PancakeSwap V2",
    tradingNotice:
      "Live market data available",

    tokenInfo: "Token information",
    tokenInfoTitle: "Transparent token structure",
    contractSection: "Official OCA Token Contract Address",
    copy: "Copy address",
    copied: "Copied",
    bscscan: "View on BscScan",
    addMetamask: "Add to MetaMask",
    securityAddress:
      "Always verify the contract address on token.ocafintech.com before buying or importing OCA Token.",

    ecosystemTitle: "OCA ecosystem utility",
    ecosystemText:
      "Holding any amount of OCA Token can make a wallet eligible for OCA member benefits across eligible OCA services.",
    shopText:
      "OCA Token holders can become eligible for OCA member benefits inside OCA Shop.",
    priceText:
      "OCA Token holders can become eligible for member discounts and premium access inside OCA Price Analyzer.",
    voiceText:
      "OCA Voice is part of the future OCA ecosystem, focused on voice automation and appointment management for small businesses.",
    marketsText:
      "OCA Markets helps users compare financial markets, crypto, stocks and exchange opportunities.",

    buyTitle: "How to buy",
    buyNotice:
      "OCA Token is now live on PancakeSwap V2 through the official OCA/WBNB pair. Always use the official contract address and the official links from token.ocafintech.com.",
    sellTitle: "How to sell",
    sellNotice:
      "OCA Token can be sold through the official OCA/WBNB pair on PancakeSwap V2. Selling depends on available liquidity, price impact and market conditions.",
    sellWarning: "Selling depends on the liquidity available in the pool.",

    burnTitle: "What is burn?",
    burnText:
      "A burn removes tokens from circulating supply by sending them to an inaccessible burn address. For OCA Token, 0.5% of buy transactions and 0.5% of sell transactions are allocated to burn.",
    treasuryTitle: "What is the treasury?",
    treasuryText:
      "The OCA treasury receives 0.5% of buy transactions and 0.5% of sell transactions. The treasury is intended to support ecosystem development, operations, liquidity growth and future OCA initiatives.",

    securityTitle: "Security and transparency",
    priceTitle: "Live price",
    pricesText: "Live price will appear after PancakeSwap liquidity is created. This section will later display OCA price, liquidity, pool ratio, market cap estimate, chart and PancakeSwap link.",
    faqTitle: "FAQ",
    footerText: "OCA Token is part of the OCA Fintech ecosystem.",
    contact: "Contact",
    officialPairTitle: "Official PancakeSwap V2 Pair",
officialPairName: "OCA/WBNB",
officialPairText:
  "This is the official OCA Token liquidity pair on PancakeSwap V2. Always verify the pair address before trading.",
viewPairOnBscScan: "View pair on BscScan",
viewChartOnDexScreener: "View chart on DEX Screener",
lpLockEyebrow: "Liquidity security",
lpLockTitle: "LP tokens locked",
lpLockText:
  "The official OCA/WBNB PancakeSwap V2 liquidity tokens are locked with Mudra Liquidity Locker.",
lpLockStatusLabel: "Status",
lpLockStatus: "Locked",
lpLockProviderLabel: "Locker",
lpLockPairLabel: "Pair",
lpLockAmountLabel: "Locked LP tokens",
lpUnlockDateLabel: "Unlock date",
lpProof: "View Mudra proof",
lpTxProof: "View lock transaction",
  },

  fr: {
    navToken: "Token",
    navUtility: "Utilité",
    navBuy: "Acheter",
    navMarket: "Données marché",
    navFaq: "FAQ",
    
    language: "EN",

    heroBadge: "Site officiel OCA Token",
    heroTitle: "OCA Token",
    heroSubtitle: "Le token utilitaire de l’écosystème OCA Fintech",
    heroText:
      "OCA Token est conçu pour connecter l’écosystème OCA Fintech, incluant OCA Shop, OCA Price Analyzer, OCA Voice, OCA Markets et les futurs services OCA.",
    viewContract: "Voir le contrat",
    howToBuy: "Acheter/vendre",
    explore: "Explorer l’écosystème OCA",
    
    buyOnPancake: "Acheter OCA sur PancakeSwap",
    sellOnPancake: "Vendre OCA sur PancakeSwap",
    pairName: "Pair officielle : OCA/WBNB",
    pairNote:
    "Sur PancakeSwap, BNB est représenté comme WBNB dans la pool de liquidité. C’est normal.",
    walletDisplayTitle: "Affichage dans le wallet",
walletImportNote:
  "Après l’achat, si OCA n’apparaît pas automatiquement dans MetaMask ou Trust Wallet, importez-le manuellement avec l’adresse officielle du contrat OCA.",

importantBeforeSelling: "Avant de vendre, assurez-vous d’utiliser la pair officielle OCA/WBNB et vérifiez l’impact sur le prix, les taxes et la liquidité disponible.",

    statusContract: "Contrat déployé",
    statusPool: "Pool de liquidité créée",
    statusTrading: "Trading actif sur PancakeSwap V2",
    tradingNotice:
      "Données marché en direct disponibles",

    tokenInfo: "Informations du token",
    tokenInfoTitle: "Structure transparente du token",
    contractSection: "Adresse officielle du contrat OCA Token",
    copy: "Copier l’adresse",
    copied: "Copié",
    bscscan: "Voir sur BscScan",
    addMetamask: "Ajouter à MetaMask",
    securityAddress:
      "Vérifiez toujours l’adresse du contrat sur token.ocafintech.com avant d’acheter ou d’importer OCA Token.",

    ecosystemTitle: "Utilité dans l’écosystème OCA",
    ecosystemText:
      "Détenir n’importe quelle quantité de OCA Token peut rendre un wallet éligible aux avantages membre OCA sur les services admissibles.",
    shopText:
      "Les détenteurs de OCA Token peuvent devenir éligibles aux avantages membre dans OCA Shop.",
    priceText:
      "Les détenteurs de OCA Token peuvent devenir éligibles à des rabais membres et à des accès premium dans OCA Price Analyzer.",
    voiceText:
      "OCA Voice fait partie du futur écosystème OCA, avec un focus sur l’automatisation vocale et la gestion des rendez-vous pour les petites entreprises.",
    marketsText:
      "OCA Markets aide les utilisateurs à comparer les marchés financiers, les cryptos, les actions et les opportunités de change.",

    buyTitle: "Comment acheter",
    buyNotice:
      "OCA Token est maintenant disponible sur PancakeSwap V2 via la pair officielle OCA/WBNB. Utilisez toujours l’adresse officielle du contrat et les liens officiels depuis token.ocafintech.com.",
    sellTitle: "Comment vendre",
    sellNotice:
      "OCA Token peut être vendu via la pair officielle OCA/WBNB sur PancakeSwap V2. La vente dépend de la liquidité disponible, de l’impact sur le prix et des conditions du marché.",
    sellWarning: "La vente dépend de la liquidité disponible dans la pool.",

    burnTitle: "C’est quoi le burn ?",
    burnText:
      "Le burn retire des tokens de la circulation en les envoyant vers une adresse inaccessible. Pour OCA Token, 0,5% des achats et 0,5% des ventes sont alloués au burn.",
    treasuryTitle: "C’est quoi la trésorerie ?",
    treasuryText:
      "La trésorerie OCA reçoit 0,5% des achats et 0,5% des ventes. Elle est destinée à soutenir le développement de l’écosystème, les opérations, la croissance de la liquidité et les futures initiatives OCA.",

    securityTitle: "Sécurité et transparence",
    priceTitle: "Prix en direct",
    pricesText:
      "Le prix en direct apparaîtra après la création de la liquidité PancakeSwap. Cette section affichera plus tard le prix OCA, la liquidité, le ratio de pool, la capitalisation estimée, le graphique et le lien PancakeSwap.",

    faqTitle: "FAQ",
    footerText: "OCA Token fait partie de l’écosystème OCA Fintech.",
    contact: "Contact",
    officialPairTitle: "Pair officielle PancakeSwap V2",
officialPairName: "OCA/WBNB",
officialPairText:
  "Ceci est la pair officielle de liquidité OCA Token sur PancakeSwap V2. Vérifiez toujours l’adresse de la pair avant de trader.",
viewPairOnBscScan: "Voir la pair sur BscScan",
viewChartOnDexScreener: "Voir le graphique sur DEX Screener",
lpLockEyebrow: "Sécurité de la liquidité",
lpLockTitle: "LP tokens verrouillés",
lpLockText:
  "Les LP tokens officiels de la pair OCA/WBNB sur PancakeSwap V2 sont verrouillés avec Mudra Liquidity Locker.",
lpLockStatusLabel: "Statut",
lpLockStatus: "Verrouillé",
lpLockProviderLabel: "Locker",
lpLockPairLabel: "Pair",
lpLockAmountLabel: "LP tokens verrouillés",
lpUnlockDateLabel: "Date de déverrouillage",
lpProof: "Voir la preuve Mudra",
lpTxProof: "Voir la transaction du lock",
  },
};

function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = text[lang];

  const shortAddress = useMemo(() => {
    const address = OCA_CONFIG.contractAddress;
    if (!address || address.length < 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }, []);

  async function copyAddress() {
    await navigator.clipboard.writeText(OCA_CONFIG.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function addToMetaMask() {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert("MetaMask is not detected in this browser.");
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: OCA_CONFIG.contractAddress,
            symbol: OCA_CONFIG.symbol,
            decimals: OCA_CONFIG.decimals,
          },
        },
      });
    } catch {
      alert("Could not add OCA Token to MetaMask.");
    }
  }

  const tokenRows = [
    ["Token name", OCA_CONFIG.tokenName],
    ["Symbol", OCA_CONFIG.symbol],
    ["Blockchain", OCA_CONFIG.blockchain],
    ["Standard", OCA_CONFIG.standard],
    ["Max supply", OCA_CONFIG.maxSupply],
    ["Mint function", OCA_CONFIG.mintFunction],
    ["Decimals", String(OCA_CONFIG.decimals)],
    ["Buy tax", "0.5% burn + 0.5% treasury"],
    ["Sell tax", "0.5% burn + 0.5% treasury"],
    ["Total buy tax", "1%"],
    ["Total sell tax", "1%"],
    ["Initial liquidity planned", OCA_CONFIG.initialLiquidity],
    ["Initial estimated price", OCA_CONFIG.initialEstimatedPrice],
    ["LP lock", OCA_CONFIG.lpLockPlan],
  ];

  const buySteps =
    lang === "en"
      ? [
          "Install MetaMask or Trust Wallet.",
          "Add BNB Smart Chain.",
          "Fund your wallet with BNB.",
          "Open the official PancakeSwap link from token.ocafintech.com.",
          "Paste the official OCA Token contract address.",
          "Choose the amount.",
          "Confirm the swap.",
        ]
      : [
          "Installez MetaMask ou Trust Wallet.",
          "Ajoutez BNB Smart Chain.",
          "Alimentez votre wallet avec du BNB.",
          "Ouvrez le lien PancakeSwap officiel depuis token.ocafintech.com.",
          "Collez l’adresse officielle du contrat OCA Token.",
          "Choisissez le montant.",
          "Confirmez le swap.",
        ];

  const sellSteps =
    lang === "en"
      ? [
          "Open PancakeSwap.",
          "Connect your wallet.",
          "Select OCA Token.",
          "Choose BNB or another token as output.",
          "Review price impact and fees.",
          "Confirm the swap.",
        ]
      : [
          "Ouvrez PancakeSwap.",
          "Connectez votre wallet.",
          "Sélectionnez OCA Token.",
          "Choisissez BNB ou un autre token en sortie.",
          "Vérifiez le price impact et les frais.",
          "Confirmez le swap.",
        ];

  const securityItems =
    lang === "en"
      ? [
          "No mint after deployment.",
          "Fixed max supply.",
          "Contract deployed on BNB Smart Chain.",
          "Official contract address displayed publicly.",
          "Liquidity pool planned on PancakeSwap.",
          "LP token are locked for 2 years.",
        ]
      : [
          "Pas de mint après le déploiement.",
          "Supply maximum fixe.",
          "Contrat déployé sur BNB Smart Chain.",
          "Adresse officielle du contrat affichée publiquement.",
          "Pool de liquidité prévue sur PancakeSwap.",
          "token lp sont Verrouillés pour 2 ans",
        ];

  const faqs =
    lang === "en"
      ? [
          ["What is OCA Token?", "OCA Token is the utility token of the OCA Fintech ecosystem."],
          ["How do I buy OCA Token?", "Buying will be available after the official PancakeSwap liquidity pool is created."],
          ["Which blockchain is OCA Token on?", "OCA Token is deployed on BNB Smart Chain."],
          ["What is the max supply?", "The max supply is 100,000,000 OCA."],
          ["Can more OCA Tokens be minted?", "No. The contract has no mint after deployment."],
          ["What is the burn?", "Burn removes tokens from circulating supply through an inaccessible burn address."],
          ["What is the treasury?", "The treasury receives 0.5% of buy and sell transactions to support the OCA ecosystem."],
          ["How do I get the 50% discount?", "Holding any amount of OCA Token can make a wallet eligible for OCA member benefits, including potential discounts across eligible OCA services."],
          ["How do I join the OCA family?", "By holding OCA Token and connecting to eligible OCA ecosystem services when integrations become available."],
          ["Can I sell my tokens?", "Selling is  possible via pancakeswap  depending on available liquidity and market conditions."],
          ["What is staking?", "Staking has not been officially decided by the OCA team yet."],
          ["Is the liquidity locked?", "LP lock is locked for 2 years."],
          ["Where can I find the official contract address?", "The official contract address is displayed on token.ocafintech.com and on the official BscScan link."],
        ]
      : [
          ["C’est quoi OCA Token ?", "OCA Token est le token utilitaire de l’écosystème OCA Fintech."],
          ["Comment acheter OCA Token ?", "L’achat sera disponible après la création officielle de la pool de liquidité PancakeSwap."],
          ["Sur quelle blockchain est OCA Token ?", "OCA Token est déployé sur BNB Smart Chain."],
          ["Quel est le supply maximum ?", "Le supply maximum est de 100 000 000 OCA."],
          ["Peut-on mint plus de OCA ?", "Non. Le contrat ne permet pas de mint après le déploiement."],
          ["C’est quoi le burn ?", "Le burn retire des tokens de la circulation via une adresse inaccessible."],
          ["C’est quoi la trésorerie ?", "La trésorerie reçoit 0,5% des achats et des ventes pour soutenir l’écosystème OCA."],
          ["Comment obtenir le rabais de 50% ?", "Détenir n’importe quelle quantité de OCA Token peut rendre un wallet éligible aux avantages membre OCA, incluant de possibles rabais sur les services admissibles."],
          ["Comment rejoindre la famille OCA ?", "En détenant OCA Token et en connectant son wallet aux services OCA admissibles lorsque les intégrations seront disponibles."],
          ["Puis-je vendre mes tokens ?", "La vente est  possible via pancakeswap , selon la liquidité disponible et les conditions du marché."],
          ["C’est quoi le staking ?", "Le staking n’a pas encore été officiellement décidé par l’équipe OCA."],
          ["La liquidité est-elle lockée ?", "Le lock LP est Verrouillé pour 2 ans."],
          ["Où trouver l’adresse officielle du contrat ?", "L’adresse officielle du contrat est affichée sur token.ocafintech.com et sur le lien officiel BscScan."],
        ];

  return (
    <main className="site">
      <header className="topbar">
  <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
    <div className="brandMark">OCA</div>
    <div>
      <strong>Token</strong>
      <span>token.ocafintech.com</span>
    </div>
  </a>

  <nav className={`nav ${menuOpen ? "navOpen" : ""}`}>
    <a href="#token" onClick={() => setMenuOpen(false)}>
      {t.navToken}
    </a>
    <a href="#utility" onClick={() => setMenuOpen(false)}>
      {t.navUtility}
    </a>
    <a className="btn secondary" href="#buy">
    {t.howToBuy}
    </a>
  
    <a href="#market-data" onClick={() => setMenuOpen(false)}>
      {t.navMarket}
    </a>
    <a href="#faq" onClick={() => setMenuOpen(false)}>
      {t.navFaq}
    </a>
  </nav>

  <div className="topbarActions">
    <button
      className="menuBtn"
      type="button"
      aria-label="Open navigation menu"
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((current) => !current)}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <button
      className="langBtn"
      type="button"
      onClick={() => {
        setLang(lang === "en" ? "fr" : "en");
        setMenuOpen(false);
      }}
    >
      {t.language}
    </button>
  </div>
</header>

      <section className="hero">
        <div className="heroText">
          <div className="pill">{t.heroBadge}</div>
          <h1>{t.heroTitle}</h1>
          <h2>{t.heroSubtitle}</h2>
          <p>{t.heroText}</p>

          <div className="heroActions">
            <a href={OCA_CONFIG.bscScanUrl} target="_blank" rel="noreferrer" className="btn primary">
              {t.viewContract}
            </a>
            <a href="#buy" className="btn secondary">
              {t.howToBuy}
            </a>
            <a href="#ecosystem" className="btn ghost">
              {t.explore}
            </a>
          </div>

          <div className="notice">
            <span>!</span>
            <p>{t.tradingNotice}</p>
          </div>
        </div>

        <aside className="heroPanel">
          <div className="coin">
            <div className="coinInner">OCA</div>
          </div>

          <div className="statusGrid">
            <div className="statusItem good">
              <span></span>
              <p>{t.statusContract}</p>
            </div>
            <div className="statusItem pending">
              <span></span>
              <p>{t.statusPool}</p>
            </div>
            <div className="statusItem pending">
              <span></span>
              <p>{t.statusTrading}</p>
            </div>
          </div>

          <div className="miniStats">
            <div>
              <span>Supply</span>
              <strong>{OCA_CONFIG.maxSupply}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>1% buy / 1% sell</strong>
            </div>
            <div>
              <span>Mint</span>
              <strong>No</strong>
            </div>
          </div>
        </aside>
      </section>
      <section className="section officialPairSection">
  <div className="sectionHeader">
    
    <h2>{t.officialPairTitle}</h2>
    <p>{t.officialPairText}</p>
  </div>

  <div className="officialPairCard">
    <div>
      <span>{t.officialPairName}</span>
      <code>{OCA_CONFIG.pancakePairAddress}</code>
    </div>

    <div className="marketActions">
      <a
        className="btn ghost"
        href={OCA_CONFIG.pancakePairBscScanUrl}
        target="_blank"
        rel="noreferrer"
      >
        {t.viewPairOnBscScan}
      </a>

      <a
        className="btn primary"
        href={OCA_CONFIG.dexScreenerUrl}
        target="_blank"
        rel="noreferrer"
      >
        {t.viewChartOnDexScreener}
      </a>
    </div>
  </div>
</section>

      <section className="section" id="token">
        <div className="sectionHead">
          <span>{t.tokenInfo}</span>
          <h2>{t.tokenInfoTitle}</h2>
        </div>

        <div className="tokenGrid">
          {tokenRows.map(([label, value]) => (
            <div className="tokenRow" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section contractSection">
        <div className="contractCard">
          <span className="eyebrow">Official source</span>
          <h2>{t.contractSection}</h2>

          <div className="addressBox">
            <code>{OCA_CONFIG.contractAddress}</code>
          </div>

          <div className="contractActions">
            <button onClick={copyAddress} className="btn primary">
              {copied ? t.copied : t.copy}
            </button>
            <a href={OCA_CONFIG.bscScanUrl} target="_blank" rel="noreferrer" className="btn secondary">
              {t.bscscan}
            </a>
            <button onClick={addToMetaMask} className="btn ghost">
              {t.addMetamask}
            </button>
          </div>

          <p className="safeText">{t.securityAddress}</p>
        </div>

        <div className="verificationCard">
          <h3>Contract status</h3>
          <div>
            <span>Network</span>
            <strong>BNB Smart Chain Mainnet</strong>
          </div>
          <div>
            <span>Contract</span>
            <strong>{shortAddress}</strong>
          </div>
          
        </div>
      </section>

      <section className="section split" id="utility">
        <div>
          <span className="eyebrow">Utility</span>
          <h2>{t.ecosystemTitle}</h2>
          <p>{t.ecosystemText}</p>
        </div>

        <div className="utilityRule">
          <strong>Member rule</strong>
          <p>Holding any amount of OCA Token can make a wallet eligible for OCA member benefits.</p>
        </div>
      </section>

      <section className="section ecosystem" id="ecosystem">
        <a href={OCA_CONFIG.ocaShop} target="_blank" rel="noreferrer" className="ecoCard">
          <span>01</span>
          <h3>OCA Shop</h3>
          <p>{t.shopText}</p>
        </a>

        <a href={OCA_CONFIG.ocaPriceAnalyzer} target="_blank" rel="noreferrer" className="ecoCard">
          <span>02</span>
          <h3>OCA Price Analyzer</h3>
          <p>{t.priceText}</p>
        </a>

        <a href={OCA_CONFIG.ocaVoice} target="_blank" rel="noreferrer" className="ecoCard">
          <span>03</span>
          <h3>OCA Voice</h3>
          <p>{t.voiceText}</p>
        </a>

        <a href={OCA_CONFIG.ocaMarkets} target="_blank" rel="noreferrer" className="ecoCard">
          <span>04</span>
          <h3>OCA Markets</h3>
          <p>{t.marketsText}</p>
        </a>
      </section>

      <section className="section process" id="buy">
        <div className="processCard">
          <span className="eyebrow">PancakeSwap</span>
          <h2>{t.buyTitle}</h2>
          
          <p>{t.buyNotice}</p>
          <a
  className="btn primary"
  href={OCA_CONFIG.pancakeBuyUrl}
  target="_blank"
  rel="noreferrer"
>
  {t.buyOnPancake}
</a>
<div className="pairInfoBox">
  <strong>{t.pairName}</strong>
  <p>{t.pairNote}</p>
</div>

<div className="walletImportBox">
  <strong>Wallet display notice</strong>
  <p>{t.walletImportNote}</p>
  <code>{OCA_CONFIG.contractAddress}</code>
</div>

          <ol>
            {buySteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="dangerText">
            Do not buy from unofficial links. Only use the contract address shown on token.ocafintech.com.
          </div>
        </div>

        <div className="processCard">
          <span className="eyebrow">Liquidity</span>
          <h2>{t.sellTitle}</h2>
          <p>{t.sellNotice}</p>
          <a
  className="btn danger"
  href={OCA_CONFIG.pancakeSellUrl}
  target="_blank"
  rel="noreferrer"
>
  {t.sellOnPancake}
</a>
<div className="pairInfoBox">
  <strong>{t.pairName}</strong>
  <p>{t.pairNote}</p>
</div>

<div className="walletImportBox sell">
  <strong>Important before selling</strong>
  <p>{t.importantBeforeSelling}</p>
</div>

          <ol>
            {sellSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="dangerText">{t.sellWarning}</div>
        </div>
      </section>

      <section className="section education">
        <div className="eduCard">
          <h2>{t.burnTitle}</h2>
          <p>{t.burnText}</p>
        </div>

        <div className="eduCard">
          <h2>{t.treasuryTitle}</h2>
          <p>{t.treasuryText}</p>
        </div>
      </section>

      <section className="section security">
        <div>
          <span className="eyebrow">Security</span>
          <h2>{t.securityTitle}</h2>
        </div>

        <div className="securityGrid">
          {securityItems.map((item) => (
            <div className="securityItem" key={item}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <LiveMarketData lang={lang} />
      <section className="section lpLockSection">
  <div className="sectionHeader">
    <span>{t.lpLockEyebrow}</span>
    
    <p>{t.lpLockText}</p>
  </div>

  <div className="lpLockGrid">
    <div className="lpLockCard locked">
      <span>{t.lpLockStatusLabel}</span>
      <strong>{t.lpLockStatus}</strong>
    </div>

    <div className="lpLockCard">
      <span>{t.lpLockProviderLabel}</span>
      <strong>{OCA_CONFIG.lpLockProvider}</strong>
    </div>

    <div className="lpLockCard">
      <span>{t.lpLockPairLabel}</span>
      <strong>{OCA_CONFIG.lpLockPairName}</strong>
    </div>

    <div className="lpLockCard">
      <span>{t.lpLockAmountLabel}</span>
      <strong>{OCA_CONFIG.lpLockedAmount}</strong>
    </div>

    <div className="lpLockCard">
      <span>{t.lpUnlockDateLabel}</span>
      <strong>{OCA_CONFIG.lpUnlockDate}</strong>
    </div>
  </div>

  <div className="lpLockActions">
    <a
      className="btn primary"
      href={OCA_CONFIG.lpLockProofUrl}
      target="_blank"
      rel="noreferrer"
    >
      {t.lpProof}
    </a>

    <a
      className="btn ghost"
      href={OCA_CONFIG.lpLockTxUrl}
      target="_blank"
      rel="noreferrer"
    >
      {t.lpTxProof}
    </a>
  </div>
</section>

      <section className="section faq" id="faq">
        <div className="sectionHead">
          
          <h2>{t.faqTitle}</h2>
        </div>

        <div className="faqGrid">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="brand footerBrand">
            <div className="brandMark">OCA</div>
            <div>
              <strong>Token</strong>
              <span>{t.footerText}</span>
            </div>
          </div>
        </div>

        <div className="footerLinks">
          <a href={OCA_CONFIG.ocaFintech} target="_blank" rel="noreferrer">OCA Fintech</a>
          <a href={OCA_CONFIG.ocaMarkets} target="_blank" rel="noreferrer">OCA Markets</a>
          <a href={OCA_CONFIG.ocaPriceAnalyzer} target="_blank" rel="noreferrer">OCA Price Analyzer</a>
          <a href={OCA_CONFIG.ocaShop} target="_blank" rel="noreferrer">OCA Shop</a>
          <a href={OCA_CONFIG.ocaVoice} target="_blank" rel="noreferrer">OCA Voice</a>
          <a href={OCA_CONFIG.bscScanUrl} target="_blank" rel="noreferrer">BscScan Contract</a>
          <span>PancakeSwap soon</span>
          <a href={`mailto:${OCA_CONFIG.contactEmail}`}>{t.contact}</a>
        </div>
      </footer>
    </main>
  );
}

export default App;