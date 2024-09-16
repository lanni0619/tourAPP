(() => {
  // public/js/mapbox.js
  var displayMap = (locations) => {
    mapboxgl.accessToken = "pk.eyJ1IjoibGFubmkwNjE5IiwiYSI6ImNtMDBsd2QxaTFydW4ya3I3OXNveDFlaDMifQ.KGRU7AyD2jJ5NmlDTQdwFg";
    const map = new mapboxgl.Map({
      container: "map",
      // container ID
      style: "mapbox://styles/lanni0619/cm00moz89007z01pwgt09e0za",
      // style URL
      scrollZoom: false
      // center: [121, 23.5], // starting position [lng, lat]
      // zoom: 6.5, // starting zoom
      // interactive: false,
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "marker";
      new mapboxgl.Marker({
        elemnt: el,
        anchor: "bottom"
      }).setLngLat(loc.coordinates).addTo(map);
      new mapboxgl.Popup({ offset: 60 }).setLngLat(loc.coordinates).setHTML(`<p>Day${loc.day}: ${loc.description}</p>`).addTo(map);
      bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  };

  // public/js/alert.js
  var hideAlert = () => {
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  };
  var showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(hideAlert, 3e3);
  };

  // public/js/login.js
  var login = async (email, password) => {
    try {
      const result = await axios({
        method: "POST",
        url: "/api/v1/users/login",
        data: {
          email,
          password
        }
      });
      if (result.data.status === "success") {
        showAlert("success", "Logged in successfully!");
        window.setTimeout(() => {
          location.assign("/");
        }, 500);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.msg);
    }
  };
  var signup = async (name, email, password, passwordConfirm) => {
    try {
      const result = await axios({
        method: "POST",
        url: "/api/v1/users/signup",
        data: {
          name,
          email,
          password,
          passwordConfirm
        }
      });
      if (result.data.status === "success") {
        showAlert("success", "Signup successfully!");
        window.setTimeout(() => {
          location.assign("/");
        }, 500);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.msg);
    }
  };
  var logout = async () => {
    try {
      const result = await axios({
        method: "GET",
        url: "/api/v1/users/logout"
      });
      if (result.data.status === "success") {
        showAlert("success", "Logged out successfully!");
        window.setTimeout(() => {
          location.assign("/");
        }, 500);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", "Error logging out! Try again.");
    }
  };

  // public/js/updateSetting.js
  var updateSetting = async (data, type) => {
    const url = type === "password" ? "/api/v1/users/updateMyPassword" : "/api/v1/users/updateMe";
    try {
      const result = await axios({
        method: "PATCH",
        url,
        data
      });
      if (result.data.status === "success") {
        showAlert("success", `${type.toUpperCase()} updated successfully!`);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.msg);
    }
  };

  // public/js/stripe.js
  var stripe = Stripe(
    "pk_test_51Pwx0CRuy8gdBuMYezNiD5cQpWuez9fExf3guTYA28XHP5cQqnum11hZCOX77QyvKfl5Nu4MDNqBq5mqS6m5WIf700erkppe1o"
  );
  var bookTour = async (tourID) => {
    try {
      const response = await axios(`/api/v1/bookings/checkout-session/${tourID}`);
      window.location.assign(response.data.session.url);
    } catch (err) {
      console.log(err);
      showAlert("error");
    }
  };

  // public/js/review.js
  var deleteReview = async (id) => {
    try {
      const result = await axios({
        method: "DELETE",
        url: `/api/v1/reviews/${id}`
      });
      if (result.data.status === "success") {
        showAlert("success", "Delete review successfully!");
        window.setTimeout(() => {
          location.assign("/my-reviews");
        }, 500);
      }
    } catch (error) {
      showAlert("error", error.response.data.msg);
    }
  };
  var createReview = async (review, rating, tourid) => {
    try {
      const result = await axios({
        method: "POST",
        url: "/api/v1/reviews",
        data: {
          review,
          rating,
          tour: tourid
        }
      });
      if (result.data.status === "success") {
        showAlert("success", "Create review successfully!");
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (error) {
      showAlert("error", error.response.data.msg);
    }
  };
  var editReview = async (rating, review, id) => {
    try {
      const result = await axios({
        method: "PATCH",
        url: `/api/v1/reviews/${id}`,
        data: {
          review,
          rating
        }
      });
      if (result.data.status === "success") {
        showAlert("success", "Edit review successfully!");
        window.setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (error) {
      showAlert("error", error.response.data.msg);
    }
  };

  // public/js/index.js
  var mapBox = document.getElementById("map");
  var loginForm = document.querySelector(".form--login");
  var signupForm = document.querySelector(".form--signup");
  var logOutBtn = document.querySelector(".nav__el--logout");
  var userDataForm = document.querySelector(".form-user-data");
  var userPasswordForm = document.querySelector(".form-user-password");
  var userReviewForm = document.querySelector(".form-user-review");
  var bookBtn = document.getElementById("book-tour");
  var myReviews = document.querySelector(".myReviews");
  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
    });
  }
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;
      signup(name, email, password, passwordConfirm);
    });
  }
  if (logOutBtn) {
    logOutBtn.addEventListener("click", (e) => {
      logout();
    });
  }
  if (userDataForm) {
    userDataForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append("name", document.getElementById("name").value);
      form.append("email", document.getElementById("email").value);
      form.append("photo", document.getElementById("photo").files[0]);
      updateSetting(form, "userData");
    });
  }
  if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelector(".btn-update-password").textContent = "updating...";
      const passwordCurrent = document.getElementById("password-current").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;
      await updateSetting(
        { passwordCurrent, password, passwordConfirm },
        "password"
      );
      document.getElementById("password-current").value = "";
      document.getElementById("password").value = "";
      document.getElementById("password-confirm").value = "";
      document.querySelector(".btn-update-password").textContent = "SAVE PASSWORD";
    });
  }
  if (bookBtn) {
    bookBtn.addEventListener("click", (e) => {
      e.target.textContent = "Processing...";
      const { tourid } = e.target.dataset;
      bookTour(tourid);
    });
  }
  if (userReviewForm) {
    userReviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const review = document.getElementById("review").value;
      const rating = document.getElementById("rating").value;
      const { tourid } = e.target.dataset;
      createReview(review, rating, tourid);
    });
  }
  if (myReviews) {
    myReviews.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const button = e.target;
        const reviewsCard = button.closest(".myReviews__card");
        const reviews = reviewsCard.parentNode;
        if (button.textContent === "Delete") {
          const reviewId = button.dataset.reviewId;
          const confirm = window.confirm(
            "Are you sure you want to delete this comment?"
          );
          if (confirm) {
            deleteReview(reviewId);
            setTimeout(() => {
              reviews.removeChild(reviewsCard);
            }, 500);
          }
        } else if (button.textContent === "Edit") {
          const reviewText = reviewsCard.querySelector(".reviews__text");
          const reviewRatingBox = reviewsCard.querySelector(".reviews__rating");
          let cancel = document.createElement("button");
          cancel.className = "review__change review__cancel";
          cancel.id = "review__cancel";
          cancel.textContent = "Cancel";
          cancel.setAttribute("data-review-text", reviewText.textContent);
          const stars = reviewsCard.querySelectorAll(".reviews__star--active");
          const inputReview = document.createElement("textarea");
          inputReview.style.width = "20rem";
          inputReview.className = "reviews__text";
          inputReview.value = reviewText.textContent;
          const inputRating = document.createElement("input");
          inputRating.className = "reviews__rating-input";
          inputRating.type = "number";
          inputRating.value = stars.length;
          reviewsCard.insertBefore(inputReview, reviewText);
          reviewsCard.insertBefore(inputRating, reviewRatingBox);
          reviewsCard.append(cancel);
          reviewsCard.removeChild(reviewText);
          button.textContent = "Save";
          button.setAttribute("data-review-id", button.dataset.reviewId);
        } else if (button.textContent === "Cancel") {
          const cancelBtn = reviewsCard.querySelector(".review__cancel");
          const editBtn = reviewsCard.querySelector(".review__edit");
          const reviewTextContent = cancelBtn.dataset.reviewText;
          const inputReview = reviewsCard.querySelector(".reviews__text");
          const inputRating = reviewsCard.querySelector(".reviews__rating-input");
          const reviewText = document.createElement("p");
          reviewText.className = "reviews__text";
          reviewText.textContent = reviewTextContent;
          reviewsCard.insertBefore(reviewText, inputReview);
          reviewsCard.removeChild(inputReview);
          reviewsCard.removeChild(inputRating);
          reviewsCard.removeChild(cancelBtn);
          editBtn.textContent = "Edit";
        } else if (button.textContent === "Save") {
          const inputReview = reviewsCard.querySelector(".reviews__text");
          const inputRating = reviewsCard.querySelector(".reviews__rating-input");
          const cancelBtn = reviewsCard.querySelector(".review__cancel");
          reviewsCard.removeChild(cancelBtn);
          const reviewText = document.createElement("p");
          reviewText.className = "reviews__text";
          reviewText.textContent = inputReview.value;
          reviewsCard.insertBefore(reviewText, inputReview);
          reviewsCard.removeChild(inputReview);
          reviewsCard.removeChild(inputRating);
          editReview(
            +inputRating.value,
            reviewText.textContent,
            button.dataset.reviewId
          );
          button.textContent = "Edit";
        }
      }
    });
  }
})();
