export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export const formatNumber = (num, decimals = 2) => {
  return parseFloat(num).toFixed(decimals);
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red',
  };
  return colors[difficulty] || 'gray';
};

export const getMealTypeColor = (mealType) => {
  const colors = {
    breakfast: 'orange',
    lunch: 'blue',
    dinner: 'purple',
    snack: 'green',
    exercise: 'red',
  };
  return colors[mealType] || 'gray';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
