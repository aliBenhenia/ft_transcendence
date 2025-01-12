// middleware.ts
import axios, { AxiosResponse, AxiosError } from 'axios';

const customAxios = axios.create({
  baseURL: 'http://localhost:9002',  
});

customAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
            window.location.href = '/';  
          break;
        case 400:
          // $1.log('Bad request:', error.response.data);
          break;
        default:
          // $1.log('An error occurred:', error.response.data);
          break;
      }
    } else {
      // $1.log('Error connecting to the server:', error.message);
    }

  
    return Promise.reject(error);
  }
);

export default customAxios;
