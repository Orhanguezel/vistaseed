import Script from "next/script";

interface AnalyticsProps {
  ga4Id?: string | null;
  gtmId?: string | null;
}

export function GoogleAnalytics({ ga4Id }: { ga4Id: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
      </Script>
    </>
  );
}

export function GoogleAdsTag({ awId, conversions }: { awId: string; conversions: Record<string, string> }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${awId}`}
        strategy="afterInteractive"
      />
      <Script id="ads-tag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${awId}');window.__adsConversions=${JSON.stringify(conversions)};(function(){try{var p=new URLSearchParams(location.search);var k=['gclid','gbraid','wbraid'];for(var i=0;i<k.length;i++){var v=p.get(k[i]);if(v){document.cookie='_vs_gclid='+encodeURIComponent(JSON.stringify({id:v,source:k[i],at:Date.now()}))+'; Max-Age=7776000; Path=/; SameSite=Lax';break;}}}catch(e){}})();`}
      </Script>
    </>
  );
}

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <script
      id="gtm-init"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
      }}
    />
  );
}

export function GtmNoscript({ gtmId }: { gtmId: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

export default function Analytics({ ga4Id, gtmId }: AnalyticsProps) {
  if (!ga4Id && !gtmId) return null;

  // GTM ve GA4 birlikte yüklenir: GTM container'a GA4 etiketi eklenmemis olsa
  // bile GA4 (G-...) dogrudan config alip veri toplar. Cift sayim olmaz cunku
  // GTM icinde ayni ID'li GA4 etiketi tanimli degil.
  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {ga4Id ? <GoogleAnalytics ga4Id={ga4Id} /> : null}
    </>
  );
}
