import request from 'browser-request';


export default function pagination (url, startAt = 0,
                                    maxRestults = Number.MAX_SAFE_INTEGER,
                                    step = 20) {
  return new Promise((resolve, reject) => {
    let results = [];
    let DOM;
    let professors;
    let parser = new DOMParser();

    function getPaginatedData (min, max) {
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
        professors = parseProfessorInfo(Array.from(DOM.getElementsByClassName('PROFESSOR')));
        results.push(...professors);
        min += step;
        if (professors.length === 0 || min >= max) {
          resolve(results);
        } else {
          return getPaginatedData(min, max);
        }
      });
    }

    getPaginatedData(startAt, maxRestults)
  });
}

function parseProfessorInfo (listings) {
  let info;
  let anchor;
  if (!listings) {
    return [];
  }
  return listings.map(listing => {
    info = {};
    anchor = listing.firstElementChild;
    info.link = 'www.ratemyprofessor.com' + anchor.getAttribute('href');
    [info.last, info.first] = anchor.getElementsByClassName('main')[0]
      .innerText.split(', ');
    return info;
  });
}
