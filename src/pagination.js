import request from 'browser-request' ;


export default function pagination (url, startAt = 0,
                                    maxRestults = NUMBER.MAX_SAFE_INTEGER,
                                    step = 20) {
  return new Promise((resolve, reject) => {
    let results = [];

    function getPaginatedData (min, max) {
      if (containsProfessorListing(results) || min >= max)  {
        console.log('HIT');
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
          results.push(body);
          getPaginatedData(min + step, max);
        });
      }
    }

    getPaginatedData(startAt, maxRestults)
  });
}


function containsProfessorListing (data) {
  let lastEntry = document.createTextNode(data.splice(-1)[0]);
  let DOM = document.createElement('div');
  DOM.appendChild(lastEntry);
  return DOM.querySelector('.listing .PROFESSOR');
}