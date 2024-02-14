import { Url } from 'next/dist/shared/lib/router/router';
import { useRouter } from 'next/router';

export function useNavigation() {
  const router = useRouter();

  const navigate = (path:Url) => {
    router.push(path);
  };

  return {
    navigate,
    currentPath: router.pathname,
  };
}