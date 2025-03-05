import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Removed viewport meta tag */}
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
          <style
            dangerouslySetInnerHTML={{
              __html:
                'html { line-height: 1.15; } body { margin: 0; } * { box-sizing: border-box; border-width: 0; border-style: solid; -webkit-font-smoothing: antialiased; } p,li,ul,pre,div,h1,h2,h3,h4,h5,h6,figure,blockquote,figcaption { margin: 0; padding: 0; } button { background-color: transparent; } button,input,optgroup,select,textarea { font-family: inherit; font-size: 100%; line-height: 1.15; margin: 0; } button,select { text-transform: none; } button,[type="button"],[type="reset"],[type="submit"] { -webkit-appearance: button; color: inherit; } button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner { border-style: none; padding: 0; } button:-moz-focus,[type="button"]:-moz-focus,[type="reset"]:-moz-focus,[type="submit"]:-moz-focus { outline: 1px dotted ButtonText; } a { color: inherit; text-decoration: inherit; } input { padding: 2px 4px; } img { display: block; } details { display: block; margin: 0; padding: 0; } summary::-webkit-details-marker { display: none; } [data-thq="accordion"] [data-thq="accordion-content"] { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out; padding: 0; } [data-thq="accordion"] details[data-thq="accordion-trigger"][open] + [data-thq="accordion-content"] { max-height: 1000vh; } details[data-thq="accordion-trigger"][open] summary [data-thq="accordion-icon"] { transform: rotate(180deg); } html { scroll-behavior: smooth; }',
            }}
            data-tag="reset-style-sheet"
          />
          <style
            dangerouslySetInnerHTML={{
              __html:
                'html { font-family: Titillium Web; font-size: 16px; } body { font-weight: 400; font-style: normal; text-decoration: none; text-transform: none; letter-spacing: normal; line-height: 1.15; color: var(--dl-color-scheme-green100); background: var(--dl-color-scheme-yellow20); fill: var(--dl-color-scheme-green100); }',
            }}
            data-tag="default-style-sheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<script defer>\nwindow.onload = () => {\n  const runAllScripts = () => {\n    initializeAllAccordions()\n  }\n\n  const listenForUrlChanges = () => {\n    let url = location.href\n    document.body.addEventListener(\n      'click',\n      () => {\n        requestAnimationFrame(() => {\n          if (url !== location.href) {\n            runAllScripts()\n            url = location.href\n          }\n        })\n      },\n      true\n    )\n  }\n\n  const initializeAllAccordions = () => {\n    const allAccordions = document.querySelectorAll('[data-role=\"Accordion\"]');\n    allAccordions.forEach((accordion) => {\n      const accordionHeader = accordion.querySelector('[data-type=\"accordion-header\"]')\n      const accordionContent = accordion.querySelector('[data-type=\"accordion-content\"]')\n      accordionHeader.addEventListener('click', () => {\n        if (accordionContent.style.maxHeight) {\n          accordionContent.style.maxHeight = ''\n        } else {\n          accordionContent.style.maxHeight = `${accordionContent.scrollHeight}px`\n        }\n      })\n    })\n  }\n\n  listenForUrlChanges()\n  runAllScripts()\n}\n</script>\n<script defer src='https://unpkg.com/@teleporthq/teleport-custom-scripts'></script>",
            }}
          ></div>
        </body>
      </Html>
    )
  }
}

export default CustomDocument;