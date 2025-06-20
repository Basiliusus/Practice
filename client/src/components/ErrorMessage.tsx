import React from 'react';

type Props = { message: string | null };

const ErrorMessage: React.FC<Props> = ({ message }) => (
  message ? <div className="error-message">{message}</div> : null
);

export default ErrorMessage; 