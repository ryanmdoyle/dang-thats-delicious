function autoComplete(input, latInput, lngInput) {
  console.log(input, latInput, lngInput);
  if (!input) return; //skip from running if no address
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();

    // sets the value of the DOM objects passed as arguments as the place lat/long
    latInput.value = place.geometry.location.lat(); 
    lngInput.value = place.geometry.location.lng();
  })

  // don't submit form when someone hit's enter
  //.on() is from "bling.js"
  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  })
}

export default autoComplete;