import { showAlert } from './alert.js';

// type = password or userData
export const updateSetting = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://localhost:3000/api/v1/users/updateMyPassword'
      : 'http://localhost:3000/api/v1/users/updateMe';

  try {
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.msg);
  }
};
