/* eslint-disable */

import { showAlert } from './alert.js';

export const deleteReview = async (id) => {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${id}`,
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Delete review successfully!');
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.msg);
  }
};

export const createReview = async (review, rating, tourid) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review,
        rating,
        tour: tourid,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Create review successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.msg);
  }
};

export const editReview = async (rating, review, id) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${id}`,
      data: {
        review,
        rating,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Edit review successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.msg);
  }
};
