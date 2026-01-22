
import { User, UserStatus } from '../types';

const USERS_KEY = 'pocus_ai_users';
const CURRENT_USER_KEY = 'pocus_ai_current_user';
const SAVED_ID_KEY = 'pocus_ai_saved_id';
const AUTO_LOGIN_KEY = 'pocus_ai_auto_login';

// Initial Admin Setup
const ADMIN_ID = 'jinuking3g';
const ADMIN_PW = 'Sool6718!';

export const initAuth = () => {
  const users = getUsers();
  const adminExists = users.some(u => u.username === ADMIN_ID);
  
  if (!adminExists) {
    const admin: User = {
      id: 'admin_1',
      username: ADMIN_ID,
      email: 'admin@pocus-ai.com',
      password: ADMIN_PW,
      status: 'approved',
      isAdmin: true,
      createdAt: Date.now(),
      occupation: 'Administrator',
      introduction: 'System Admin'
    };
    saveUsers([...users, admin]);
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (
  username: string, 
  email: string,
  password: string,
  metadata: { occupation: string, introduction: string, purpose: string, referral: string }
): { success: boolean, message: string } => {
  const users = getUsers();
  if (users.some(u => u.username === username)) {
    return { success: false, message: 'Username already exists.' };
  }
  if (users.some(u => u.email === email)) {
    return { success: false, message: 'Email already registered.' };
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    password,
    status: 'pending',
    isAdmin: false,
    createdAt: Date.now(),
    ...metadata
  };

  saveUsers([...users, newUser]);
  return { success: true, message: 'Signup successful! Please wait for administrator approval.' };
};

export const login = (
  username: string, 
  password: string, 
  rememberId: boolean, 
  autoLogin: boolean
): { success: boolean, user?: User, message: string } => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return { success: false, message: 'Invalid username or password.' };
  }

  if (user.status !== 'approved') {
    return { success: false, message: 'Account pending approval. Please contact the administrator.' };
  }

  // Handle Persistence
  if (rememberId) {
    localStorage.setItem(SAVED_ID_KEY, username);
  } else {
    localStorage.removeItem(SAVED_ID_KEY);
  }

  if (autoLogin) {
    localStorage.setItem(AUTO_LOGIN_KEY, 'true');
  } else {
    localStorage.removeItem(AUTO_LOGIN_KEY);
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user, message: 'Login successful.' };
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(AUTO_LOGIN_KEY);
};

export const getCurrentUser = (): User | null => {
  const isAutoLogin = localStorage.getItem(AUTO_LOGIN_KEY) === 'true';
  const data = localStorage.getItem(CURRENT_USER_KEY);
  
  if (isAutoLogin && data) {
    return JSON.parse(data);
  }
  
  // If not auto-login, we still return the user if they haven't explicitly logged out in this session.
  // But for stricter auto-login, we check the flag. 
  // Let's allow returning user if present, but App.tsx will control the initial view based on autoLogin flag if desired.
  return data ? JSON.parse(data) : null;
};

export const getSavedId = (): string => {
  return localStorage.getItem(SAVED_ID_KEY) || '';
};

export const isAutoLoginEnabled = (): boolean => {
  return localStorage.getItem(AUTO_LOGIN_KEY) === 'true';
};

export const updateStatus = (userId: string, status: UserStatus) => {
  const users = getUsers();
  const updated = users.map(u => u.id === userId ? { ...u, status } : u);
  saveUsers(updated);
};

export const deleteUser = (userId: string) => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  saveUsers(filtered);
};
