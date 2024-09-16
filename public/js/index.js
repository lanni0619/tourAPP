/* eslint-disable */

import { displayMap } from './mapbox.js';
import { login, logout, signup } from './login.js';
import { updateSetting } from './updateSetting.js';
import { bookTour } from './stripe.js';
import { createReview, deleteReview, editReview } from './review.js';

// Values

// Create DOM element
const mapBox = document.getElementById('map');
// auth
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
// form
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userReviewForm = document.querySelector('.form-user-review');
const bookBtn = document.getElementById('book-tour');
const reviews = document.querySelector('.reviews');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}
if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    logout();
  });
}
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // https://developer.mozilla.org/en-US/docs/Web/API/FormData
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSetting(form, 'userData');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Change button text
    document.querySelector('.btn-update-password').textContent = 'updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSetting(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    // Clean the password at the browser
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    // Reset button text
    document.querySelector('.btn-update-password').textContent =
      'SAVE PASSWORD';
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourid } = e.target.dataset;
    bookTour(tourid);
  });
}
if (userReviewForm) {
  userReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const { tourid } = e.target.dataset;
    createReview(review, rating, tourid);
  });
}

if (reviews) {
  reviews.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const reviewsCard = button.closest('.reviews__card');
      const reviews = reviewsCard.parentNode;
      if (button.textContent === 'Delete') {
        const reviewId = button.dataset.reviewId;
        const confirm = window.confirm('Are you sure to delete the review?');
        if (confirm) {
          deleteReview(reviewId);
          setTimeout(() => {
            reviews.removeChild(reviewsCard);
          }, 500);
        }
      } else if (button.textContent === 'Edit') {
        const reviewText = reviewsCard.querySelector('.reviews__text');
        const reviewRatingBox = reviewsCard.querySelector('.reviews__rating');

        /// Cancel button
        let cancel = document.createElement('button');
        cancel.className = 'review__change review__cancel';
        cancel.id = 'review__cancel';
        cancel.textContent = 'Cancel';
        cancel.setAttribute('data-review-text', reviewText.textContent);

        /// Find the rating number
        const stars = reviewsCard.querySelectorAll('.reviews__star--active');

        // InputReview
        const inputReview = document.createElement('textarea');
        inputReview.style.width = '25.8rem';
        inputReview.className = 'reviews__text';
        inputReview.value = reviewText.textContent;

        // InputRating
        const inputRating = document.createElement('input');
        inputRating.className = 'reviews__rating-input';
        inputRating.type = 'number';
        inputRating.value = stars.length;

        reviewsCard.insertBefore(inputReview, reviewText);
        reviewsCard.insertBefore(inputRating, reviewRatingBox);
        reviewsCard.append(cancel);

        reviewsCard.removeChild(reviewText);
        button.textContent = 'Save';
        button.setAttribute('data-review-id', button.dataset.reviewId);
      } else if (button.textContent === 'Cancel') {
        const cancelBtn = reviewsCard.querySelector('.review__cancel');
        const editBtn = reviewsCard.querySelector('.review__edit');
        const reviewTextContent = cancelBtn.dataset.reviewText;
        const inputReview = reviewsCard.querySelector('.reviews__text');
        const inputRating = reviewsCard.querySelector('.reviews__rating-input');

        const reviewText = document.createElement('p');
        reviewText.className = 'reviews__text';
        reviewText.textContent = reviewTextContent;

        reviewsCard.insertBefore(reviewText, inputReview);

        reviewsCard.removeChild(inputReview);
        reviewsCard.removeChild(inputRating);

        reviewsCard.removeChild(cancelBtn);
        editBtn.textContent = 'Edit';
      } else if (button.textContent === 'Save') {
        const inputReview = reviewsCard.querySelector('.reviews__text');
        const inputRating = reviewsCard.querySelector('.reviews__rating-input');
        const cancelBtn = reviewsCard.querySelector('.review__cancel');
        reviewsCard.removeChild(cancelBtn);

        const reviewText = document.createElement('p');
        reviewText.className = 'reviews__text';
        reviewText.textContent = inputReview.value;
        reviewsCard.insertBefore(reviewText, inputReview);

        reviewsCard.removeChild(inputReview);
        reviewsCard.removeChild(inputRating);

        editReview(
          +inputRating.value,
          reviewText.textContent,
          button.dataset.reviewId,
        );

        button.textContent = 'Edit';
      }
    }
  });
}
