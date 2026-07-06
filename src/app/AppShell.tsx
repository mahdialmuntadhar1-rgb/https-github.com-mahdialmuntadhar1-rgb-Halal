import React, { useEffect, useState } from 'react';
import { store } from './store';

export default function AppShell() {
  const [state, setState] = useState(store.getState());

  useEffect(() => store.subscribe(setState), []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Current: {state.activeTab}</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => store.navigate('landing')}>Landing</button>
        <button onClick={() => store.navigate('auth')}>Auth</button>
        <button onClick={() => store.navigate('explore')}>Explore</button>
        <button onClick={() => store.navigate('chat')}>Chat</button>
        <button onClick={() => store.navigate('community')}>Community</button>
      </div>

      <div>
        {state.activeTab === 'auth' && <div>?? Auth Screen</div>}
        {state.activeTab === 'landing' && <div>?? Landing</div>}
        {state.activeTab === 'explore' && <div>?? Explore</div>}
        {state.activeTab === 'chat' && <div>?? Chat</div>}
        {state.activeTab === 'community' && <div>?? Community</div>}
      </div>
    </div>
  );
}
