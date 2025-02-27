const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const config = {
  apiUrl: apiUrl,
  authServiceUrl: `${apiUrl}/axion-auth-service`,
  discGolfServiceUrl: `${apiUrl}/disc-golf-service`,
};

export default config;
