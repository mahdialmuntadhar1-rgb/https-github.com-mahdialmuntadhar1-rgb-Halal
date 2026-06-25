import React from 'react';
import { HeaderLanguageSelector } from './HeaderLanguageSelector';

export function I18nFloatingControl() {
  return (
    <div className="fixed right-3 top-3 z-[9999]">
      <HeaderLanguageSelector />
    </div>
  );
}
