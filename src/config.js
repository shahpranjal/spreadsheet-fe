const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:5000';

const config = {
    baseUrl,
    usersUrl: `${baseUrl}/api/users`,
    banksUrl: `${baseUrl}/api/banks`,
    categoriesUrl: `${baseUrl}/api/categories`,
    uploadUrl: `${baseUrl}/api/upload`,
    transactionUrl: `${baseUrl}/api/transactions`,
};

export default config;
