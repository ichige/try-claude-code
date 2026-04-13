import { defineBoot } from '#q-app/wrappers';
import { MSAuth } from '@shisamo/shared';

console.debug('[auth boot] VITE_MSAL_CLIENT_ID:', import.meta.env.VITE_MSAL_CLIENT_ID);
console.debug('[auth boot] VITE_MSAL_AUTHORITY:', import.meta.env.VITE_MSAL_AUTHORITY);
console.debug('[auth boot] VITE_MSAL_REDIRECT_URI:', import.meta.env.VITE_MSAL_REDIRECT_URI);

export const auth = new MSAuth({
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
  },
});

export default defineBoot(() => {
  // MSAuth は各メソッド内で initialize() を呼ぶため、ここでの処理は不要
});
