/* eslint-disable */

import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    // 1) Send http request to node application
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    // 2) direct to homepage
    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
    console.log(result);
  } catch (error) {
    console.log(error);

    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    console.log(result);
    if (result.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      // reload from the server
      location.reload(true);
    }
  } catch (error) {
    console.log(error.response);

    showAlert('error', 'Error logging out! Try again.');
  }
};
