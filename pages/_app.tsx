import '../styles/custom-bootstrap.scss';
import App, { AppProps } from 'next/app';

function SparkOtto({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

SparkOtto.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default SparkOtto;