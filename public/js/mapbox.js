/* eslint-disable*/
// Setting for node.js only

console.log('Hello there from the client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// https://docs.mapbox.com/mapbox-gl-js/guides

mapboxgl.accessToken =
  'pk.eyJ1IjoibGFubmkwNjE5IiwiYSI6ImNtMDBsd2QxaTFydW4ya3I3OXNveDFlaDMifQ.KGRU7AyD2jJ5NmlDTQdwFg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/lanni0619/cm00moz89007z01pwgt09e0za', // style URL
  scrollZoom: false,
  // center: [121, 23.5], // starting position [lng, lat]
  // zoom: 6.5, // starting zoom
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  // "marker" is a green pin which specified in style.css (line: 554)
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    elemnt: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({ offset: 60 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend the map bounds to include current location
  bounds.extend(loc.coordinates);
});

// Execute zooming & moving
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
