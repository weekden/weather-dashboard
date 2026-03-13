import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps): React.JSX.Element {
  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl p-6 text-white text-center">
      <p className="text-white/80 text-sm">{message}</p>
    </div>
  );
}
