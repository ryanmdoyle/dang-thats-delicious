import axios from 'axios'; // an ajax package that has some addl. functionality
import dompurify from 'dompurify';

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
    
    if (this.value.length > 2) { //reduces api calls to searches with 3+ characters
      axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
        }
        searchResults.innerHTML = dompurify.sanitize(`<div class='search__result'> No results for ${this.value} found!</div>`);
      })
      .catch(err => { //don't forget you have to catch promises!
        console.error(err);
      })
    }
  });

  searchInput.on('keyup', (e) => {
    // skip everything but up and down
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length-1];
    } else if (e.keyCode === 38){
      next = items[items.length-1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  })

}

export default typeAhead;