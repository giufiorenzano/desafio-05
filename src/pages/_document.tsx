import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
      return (
        <Html lang="en">
          <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
          </Head>

          <body>
            <Main />
            <NextScript />
          </body>
      </Html>
    )
  }
}
