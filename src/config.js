// config.js
const config = {
    api_base_url: "http://139.59.46.75/api",  // Your API base URL
    endpoints: {
        login: '/v1/auth/login/',
        signup: '/v1/auth/signup/',
        refresh: '/v1/auth/refresh/',
        verifyOtp: '/v1/auth/verify-otp/'
    }
};

export default config;