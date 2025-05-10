
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { PARENT_MOCK_USER, TEACHER_MOCK_USER } from '@/lib/placeholder-data';

interface UserRoleContextType {
  currentUser: User | null;
  isLoadingRole: boolean;
  loginAs: (role: 'parent' | 'teacher') => void;
  logout: () => void;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const USER_ROLE_STORAGE_KEY = 'eduAttendMockUserRole';

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY);
      if (storedRole === 'parent') {
        setCurrentUser(PARENT_MOCK_USER);
      } else if (storedRole === 'teacher') {
        setCurrentUser(TEACHER_MOCK_USER);
      }
    } catch (error) {
      // localStorage might not be available (e.g. SSR initial render)
      console.warn('localStorage not available for role loading, or error:', error);
    }
    setIsLoadingRole(false);
  }, []);

  const loginAs = useCallback((role: 'parent' | 'teacher') => {
    if (role === 'parent') {
      setCurrentUser(PARENT_MOCK_USER);
      localStorage.setItem(USER_ROLE_STORAGE_KEY, 'parent');
    } else {
      setCurrentUser(TEACHER_MOCK_USER);
      localStorage.setItem(USER_ROLE_STORAGE_KEY, 'teacher');
    }
    setIsLoadingRole(false);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    setIsLoadingRole(false); // Explicitly set loading to false on logout
  }, []);

  return (
    <UserRoleContext.Provider value={{ currentUser, isLoadingRole, loginAs, logout }}>
      {children}
    </UserRoleContext.Provider>
  );
}
