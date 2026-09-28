import { useGoogleLogin } from '@react-oauth/google';

/**
 * Custom hook wrapper for useGoogleLogin that gracefully handles cases
 * where GoogleOAuthProvider context is missing (such as in unit tests).
 */
export function useSafeGoogleLogin(options) {
  try {
    return useGoogleLogin(options);
  } catch (err) {
    return (overrideOptions) => {
      if (options?.onError) {
        options.onError(err);
      }
    };
  }
}
