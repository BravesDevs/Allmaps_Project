import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const clearToken = () => {
    localStorage.removeItem('token');
};

export interface LoginDto {
    email: string;
    password: string;
}

export interface SignupDto {
    email: string;
    password: string;
}

export interface GenerateRoadmapDto {
    topic: string;
    difficulty: string;
}

export interface SaveRoadmapDto {
    topic: string;
    difficulty: string;
    data: any;
    userId: number;
}

export const authApi = {
    login: (data: LoginDto) => api.post('/auth/login', data),
    signup: (data: SignupDto) => api.post('/auth/signup', data),
};

export const roadmapApi = {
    generate: (data: GenerateRoadmapDto) => api.post('/roadmap/generate', data),
    save: (data: SaveRoadmapDto) => api.post('/roadmap/save', data),
    getUserRoadmaps: (userId: number) => api.get(`/roadmap/user/${userId}`),
};

export default api;
