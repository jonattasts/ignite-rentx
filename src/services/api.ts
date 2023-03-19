import axios from 'axios';

const api = axios.create({
  baseURL: 'http://xxx.xxx.x.xxx:3000',
});

export { api };