const apiUrl = `${process.env.REACT_APP_API_URL}/api`;

const config = {
  apiUrl: apiUrl,
  authServiceUrl: `${apiUrl}/axion-auth-service`,
  discGolfServiceUrl: `${apiUrl}/disc-golf-service`,
};

export default config;
