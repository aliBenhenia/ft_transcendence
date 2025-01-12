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
        // $1.log(error.response.data);
        return error.response.data;
    }
};

export const login = async (email: string, password: string) => {
   try {
        const response = await apiClient.post('/auth/token/login/', {
            email,
            password,
        });
        // $1.log(response.data.token);
        return response.data;
    }
    catch (error: any) {
        // $1.log(error.response.data);
        return error.response.data;
    }
};

