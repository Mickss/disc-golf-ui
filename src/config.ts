const apiUrl: string = `${import.meta.env.VITE_API_URL}/api`;

interface ServiceConfig {
  apiUrl: string;
  authServiceUrl: string;
  discGolfServiceUrl: string;
}

const config: ServiceConfig = {
  apiUrl: apiUrl,
  authServiceUrl: `${apiUrl}/axion-auth-service`,
  discGolfServiceUrl: `${apiUrl}/disc-golf-service`,
};

export default config;
