// Safe localStorage utilities to handle edge cases

export const getStoredToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'null' || userStr === 'undefined') {
      return null;
    }
    
    const user = JSON.parse(userStr);
    if (!user || typeof user !== 'object' || !user.id) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const setAuthData = (token, user) => {
  try {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};