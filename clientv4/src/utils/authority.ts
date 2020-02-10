import { reloadAuthorized } from './Authorized';

import jwtDecode from 'jwt-decode';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('token') : str;

  let authority;

  if (authorityString !== null) {
    try {
      console.log(jwtDecode(authorityString));
      authority = (jwtDecode(authorityString) as any).currentAuthority;
    } catch (e) {
      authority = authorityString;
    }
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('token', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
