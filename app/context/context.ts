import React, { createContext, useState, useContext } from 'react';
export type Iuser = {
  created_at: string;
  display_name: string;
  email: string;
  id: string;
  image_url: string;
  role: string;
} | null;

interface UserContextType {
  user: Iuser | null;
  setUser: (user: Iuser | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {
    /* default implementation */
  },
});

export default UserContext;
