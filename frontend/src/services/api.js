import axios from 'axios';

// Criamos uma instância do Axios apontando para a porta do seu Back-end (.NET)
export const api = axios.create({
    baseURL: 'http://localhost:5092/api',
});