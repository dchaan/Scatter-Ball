/* I'd recommend adding a DOMContentLoaded event listener, 
and in that callback doing some basic DOM manipulation. */
document.addEventListener("DOMContentLoaded", () => {
  console.log('Hello World')
})

// src/index.js

// const demoUrl = 'https://www.metaweather.com/api/location/search/?query=san';
// const corsRequest = (url = demoUrl) => {
//   fetch(`/cors?url=${encodeURIComponent(url)}`)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//     })
// }

// const apiRequest = (query = 'curry') => {
//   fetch(`/api?searchTerm=${encodeURIComponent(query)}`)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//     })
// }

/* 
Before Refactor:

const apiRequest = (query = 'curry') => { 
  fetch(`https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
}
*/