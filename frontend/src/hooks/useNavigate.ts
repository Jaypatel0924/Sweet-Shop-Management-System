import { useState } from 'react';

type Page = 'dashboard' | 'login' | 'register';

let currentPage: Page = 'login';
const listeners: (() => void)[] = [];

export const useNavigate = () => {
  const [, setPage] = useState<Page>(currentPage);

  const navigate = (page: Page | string) => {
    currentPage = (page === '/' ? 'dashboard' : page.slice(1)) as Page;
    setPage(currentPage);
    listeners.forEach(listener => listener());
  };

  return navigate;
};

export const usePage = () => {
  const [page, setPage] = useState<Page>(currentPage);

  React.useEffect(() => {
    const listener = () => setPage(currentPage);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return page;
};

import React from 'react';
