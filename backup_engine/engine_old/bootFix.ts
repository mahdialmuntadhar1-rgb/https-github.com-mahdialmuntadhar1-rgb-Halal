import { forceApiBoot } from './_forceApiBootFix';

export function safeEngineBoot(engine: any) {
  try {
    // FORCE register API first
    forceApiBoot(engine);

    // mark engine as safe
    engine.__safeBoot = true;

    console.log('[ENGINE] Safe boot completed');
  } catch (e) {
    console.error('[ENGINE] Boot failed but recovered', e);
  }
}
