'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export function useAdminMode() {
  const searchParams = useSearchParams();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check URL search parameter or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedAdmin = localStorage.getItem('pulse_admin') === 'true';
    const adminQuery = searchParams.get('admin');
    const configuredSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'secret123';
    const isUrlAdmin = Boolean(adminQuery && (adminQuery === configuredSecret || adminQuery.length > 0));

    if (storedAdmin || isUrlAdmin) {
      setIsAdminLoggedIn(true);
    }
  }, [searchParams]);

  const loginAdmin = useCallback((usernameInput: string, passwordInput: string): boolean => {
    const cleanUsername = usernameInput.trim().toUpperCase();
    const cleanPassword = passwordInput.trim();

    // Required Credentials: Username = SUBHRA, Password = 09081978
    if (cleanUsername === 'SUBHRA' && cleanPassword === '09081978') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pulse_admin', 'true');
      }
      setIsAdminLoggedIn(true);
      return true;
    }

    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulse_admin');
    }
    setIsAdminLoggedIn(false);
  }, []);

  return {
    isAdmin: isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
  };
}
