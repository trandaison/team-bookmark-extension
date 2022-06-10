export type AuthTokens = {
  token: string;
  refresh_token: string;
};

const [ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME] = [
  'access_token',
  'refresh_token',
];

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_NAME) || null;
};

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_NAME, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_NAME) || null;
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_NAME, token);
};

export const setAuth = ({ token, refresh_token }: AuthTokens) => {
  setAccessToken(token);
  setRefreshToken(refresh_token);
};

export const resetAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_NAME);
  localStorage.removeItem(REFRESH_TOKEN_NAME);
};

export const isLoggedIn = () => !!getAccessToken();
