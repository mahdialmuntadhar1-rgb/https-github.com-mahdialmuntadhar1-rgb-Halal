import React from 'react';
import ReactDOM from 'react-dom/client';
import AppShell from './AppShell';
import { bootApp } from './controller';

export async function bootstrap() {
  const root = document.getElementById('root');

  if (!root) {
    document.body.innerHTML = 'ROOT MISSING';
    return;
  }

  await bootApp();

  ReactDOM.createRoot(root).render(
    React.createElement(AppShell)
  );
}
