import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta property="twitter:card" content="summary_large_image" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/animate.css@4.1.1/animate.css"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap"
            data-tag="font"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
            data-tag="font"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            data-tag="font"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap"
            data-tag="font"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@teleporthq/teleport-custom-scripts/dist/style.css"
          />
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDIJPLNjk7OMPfEIfs9pGo20LmHKkzzsu0&libraries=places`}
            async
            defer
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;