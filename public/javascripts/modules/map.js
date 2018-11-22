import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 42.3, lng: -79.8},
  zoom: 8
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if (!places.length) {
        alert('no places found near the address');
      }
      // bounds for markers
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position); //extends bounds to fit this position
        const marker = new google.maps.Marker({
          map,
          position //like map:map, position: position
        })
        marker.place = place; //adds the store "place" to the marker
        console.log(marker);
        return marker;
      });

      markers.forEach(marker => marker.addListener('click', function() {
        // "this" is the marker object so all the info is there
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
              <p> ${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));
      //set zoom of map to fit all the markers and center
      map.setCenter(bounds.getCenter()); //gets center of bounds
      map.fitBounds(bounds); //fit the map to all the markers 
    });
}

function makeMap(mapDiv) {
  console.log('makeMap is running');
  if (!mapDiv) return;
  //make the map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
  })
}

export default makeMap;