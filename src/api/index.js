import request from '../utils/requst';

export const test = () => {
  return request({
    url: '/static/demo.json',
  });
};
