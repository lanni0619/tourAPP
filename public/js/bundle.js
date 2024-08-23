(() => {
  // public/js/mapbox.js
  console.log("Hello there from the client side");
  var displayMap = (locations2) => {
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
    locations2.forEach((loc) => {
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
      console.log(result);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
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
        location.reload(true);
      }
    } catch (error) {
      console.log(error.response);
      showAlert("error", "Error logging out! Try again.");
    }
  };

  // public/js/index.js
  var mapBox = document.getElementById("map");
  var loginForm = document.querySelector(".form");
  var logOutBtn = document.querySelector(".nav__el--logout");
  if (mapBox) {
    locations = JSON.parse(mapBox.dataset.locations);
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
  if (logOutBtn) {
    logOutBtn.addEventListener("click", (e) => {
      console.log("logout");
      logout();
    });
  }
})();
