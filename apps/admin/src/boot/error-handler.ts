import { defineBoot } from '#q-app/wrappers';
import { getLogger } from 'src/boot/logger';

const logger = getLogger('error-handler');

export default defineBoot(({ app, router }) => {
  /**
   * Vue コンポーネントツリー内でキャッチされなかった例外を処理する。
   */
  app.config.errorHandler = (err, _instance, info) => {
    console.error('[Vue errorHandler]', err, info);
    logger.error('vue error', { err, info });
    void router.push({ name: 'error' });
  };

  /**
   * Promise のハンドルされなかった rejection を処理する。
   */
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[unhandledrejection]', event.reason);
    logger.error('unhandled rejection', { reason: event.reason });
    void router.push({ name: 'error' });
  });
});
