import apiClient from "./apiClient";


export const register = async (username: string, email: string, password: string) => {
    try {
        const response = await apiClient.post('/auth/users/', {
            username,
            email,
            password,
        });
        return response.data;
    }
    catch (error: any) {
        console.log(error.response.data);
        return error.response.data;
    }
};

export const login = async (email: string, password: string) => {
   try {
        const response = await apiClient.post('/auth/token/login/', {
            email,
            password,
        });
        console.log(response.data.token);
        return response.data;
    }
    catch (error: any) {
        console.log(error.response.data);
        return error.response.data;
    }
};

