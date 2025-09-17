// Utility functions for localStorage management

export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear any other auth-related data
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      return null;
    }
    
    const userData = JSON.parse(storedUser);
    if (!userData || typeof userData !== 'object' || !userData.id) {
      return null;
    }
    
    return userData;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const getStoredToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

export const setAuthData = (token, user) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};
