import axios from 'axios';

const instance = axios.create({});

const request = (...args) => {
  return instance.request(...args);
};

export default request;
