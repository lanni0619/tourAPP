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
        url: "http://localhost:3000/api/v1/users/login",
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
        url: "http://localhost:3000/api/v1/users/signup",
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
        url: "http://localhost:3000/api/v1/users/logout"
      });
      console.log(result);
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
    const url = type === "password" ? "http://localhost:3000/api/v1/users/updateMyPassword" : "http://localhost:3000/api/v1/users/updateMe";
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
      const response = await axios(
        `http://localhost:3000/api/v1/bookings/checkout-session/${tourID}`
      );
      console.log(response);
      window.location.assign(response.data.session.url);
    } catch (err) {
      console.log(err);
      showAlert("error");
    }
  };

  // public/js/index.js
  var mapBox = document.getElementById("map");
  var loginForm = document.querySelector(".form--login");
  var signupForm = document.querySelector(".form--signup");
  var logOutBtn = document.querySelector(".nav__el--logout");
  var userDataForm = document.querySelector(".form-user-data");
  var userPasswordForm = document.querySelector(".form-user-password");
  var bookBtn = document.getElementById("book-tour");
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
})();
