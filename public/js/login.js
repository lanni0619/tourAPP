/* eslint-disable */

import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    // 1) Send http request to node application
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
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
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.msg);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    // 1) Send http request to node application
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    // 2) direct to homepage
    if (result.data.status === 'success') {
      showAlert('success', 'Signup successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.msg);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      // reload from the server
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
      // location.reload(true);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', 'Error logging out! Try again.');
  }
};
