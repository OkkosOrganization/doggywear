import Document, {
  DocumentContext,
  Html,
  Main,
  NextScript,
} from 'next/document';

class DoggyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default DoggyDocument;
