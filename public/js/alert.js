/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  // el.parentElement = body, body.removeChild identical remove el
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 3000);
};
