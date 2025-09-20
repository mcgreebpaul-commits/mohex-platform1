// --- frontend/src/pages/_app.tsx ---
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mohex AI Trading</title>
        <meta name="description" content="AI-powered crypto trading agent platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      {/* Smartsupp Live Chat Script */}
      <Script
        id="smartsupp-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '59a75061188c44d51b86d01df344930e636b7765';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o.call.apply(o.call,arguments)};o.call=new Array();
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
        }}
      />
    </>
  );
}