/* eslint-disable */

// console.log('Hello from parcel!');
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';

// Values

// Create DOM element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

// Delegation
if (mapBox) {
  locations = JSON.parse(mapBox.dataset.locations);
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

if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    console.log('logout');
    logout();
  });
}
