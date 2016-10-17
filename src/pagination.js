import request from 'browser-request' ;


export default function pagination (url, startAt = 0,
                                    maxRestults = Number.MAX_SAFE_INTEGER,
                                    step = 20) {
  let parser = new DOMParser();
  let DOM;

  return new Promise((resolve, reject) => {
    let results = [];

    function getPaginatedData (min, max) {
      if (containsProfessorListing(results) || min >= max) {
        resolve(results);
      } else {
        request({
          url: url,
          qs: { 'offset': min },
          headers: { 'Content-Type': 'text/html' },
          method: 'GET'
        }, (error, response, body) => {
          if (error) {
            reject(error);
          }
          DOM = parser.parseFromString(body, "text/html");
          let foo = Array.from(DOM.querySelectorAll('.PROFESSOR'));
          results.push(...foo);
          return getPaginatedData(min + step, max);
        });
      }
    }

    getPaginatedData(startAt, maxRestults)
  });
}

function parseProfessorInfo(listing) {
  let info = {};
  //listing.
  // Parse the listing HTML and insert it into info listing looks like such:
  /*
   <li class="listing PROFESSOR">
     <a href="/ShowRatings.jsp?tid=132256">
       <span class="listing-cat">
         <span class="icon icon-professor"></span>
         PROFESSOR
       </span>
       <span class="listing-name">
         <span class="main">Fant, Karla </span>
         <span class="sub">Portland State University, Computer Science</span>
       </span>
     </a>
   </li>
   */

}

function containsProfessorListing (HTMLString) {
  let parser = new DOMParser();
  let DOM = parser.parseFromString(HTMLString, "text/html");
  return DOM.querySelector('.listing .PROFESSOR');
}