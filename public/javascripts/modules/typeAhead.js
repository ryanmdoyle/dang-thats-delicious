const axios = require('axios'); // an ajax package that has some addl. functionality

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href='/store/${store.slug}' class='search__result'>
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return; //won't run if search is not on page

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {//.on is from bling.js, same as eventlistener
    // Hide if no search results
    if (!this.value) {
      searchResults.style.display = 'none';
      return; //stop func
    }
    // Show if there are search results
    searchResults.style.display = 'block'; //make div visible
    searchResults.innerHTML = '';
    
    if (this.value.length > 2) { //reduces api calls to searches with 3+ characters
      axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = searchResultsHTML(res.data)
        }
      })
      .catch(err => { //don't forget you have to catch promises!
        console.error(err);
      })
    }
  })
}

export default typeAhead;