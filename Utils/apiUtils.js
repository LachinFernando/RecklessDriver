import axios from 'axios';

const postRequest = async (url, body) => {
  try {
    const res = await axios.post(url, body);
    return res;
  } catch (error) {
    console.log(error.toString());
  }
};

export const api = {
  post: postRequest,
};
