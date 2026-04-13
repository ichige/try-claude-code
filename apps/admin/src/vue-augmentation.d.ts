import type { Logger } from '@shisamo/shared';

declare module 'vue' {
  interface ComponentCustomProperties {
    $logger: Logger;
  }
}
