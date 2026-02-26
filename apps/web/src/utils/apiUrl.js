const getApiUrl = () => {
  // Check if we have an explicit CMS URL set
  if (import.meta.env.VITE_CMS_URL) {
    return import.meta.env.VITE_CMS_URL;
  }
  
  // In production, determine API URL based on current domain
  if (import.meta.env.PROD) {
    const hostname = window.location.hostname;
    
    if (hostname === 'dev.kingandcarter.com') {
      return 'https://dev.kingandcarter.com';
    } else if (hostname === 'kingandcarter.com') {
      return 'https://kingandcarter.com';
    } else if (hostname.includes('vercel.app')) {
      return 'https://king-carter.vercel.app';
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:3001';
};

export default getApiUrl;