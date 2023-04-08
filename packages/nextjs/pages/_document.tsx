import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="dark min-h-screen">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400&amp;display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="min-h-screen overflow-y- min-h-screen scroll-smooth bg-white selection:bg-primary/10 selection:text-primary dark:bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
