/* eslint-disable */
import { showAlert } from './alert.js';

const stripe = Stripe(
  'pk_test_51Pwx0CRuy8gdBuMYezNiD5cQpWuez9fExf3guTYA28XHP5cQqnum11hZCOX77QyvKfl5Nu4MDNqBq5mqS6m5WIf700erkppe1o',
);

export const bookTour = async (tourID) => {
  try {
    // 1) Get Checkout session
    const response = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourID}`,
    );
    console.log(response);

    // 2) Redirect to checkout form
    window.location.assign(response.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error');
  }
};
