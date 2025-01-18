import { NextPageContext } from 'next';
import LogRocket from 'logrocket';

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  if (statusCode >= 500) {
    LogRocket.captureException(new Error(`Internal Server Error: ${statusCode}`)); // Capture the error in LogRocket
  }

  return (
    <div>
      <h1>An error occurred</h1>
      <p>Status code: {statusCode}</p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default ErrorPage;
