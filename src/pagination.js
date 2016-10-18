import request from 'browser-request';

function getProfessorLinks (url) {
  return new Promise((resolve, request) => {
    let results = [];
    let DOM;
    let professorLink;
    let parser = new DOMParser();

    request({
      url: url,
      headers: { 'Content-Type': 'text/html' },
      method: 'GET'
    }, (error, response, body) => {
      if (error) {
        reject(error);
      }
      DOM = parser.parseFromString(body, "text/html");
      professorLink = parseProfessorLink(Array.from(DOM.getElementsByClassName('PROFESSOR')));
      results.push(...professorLink);
      resolve(results);
    });
  });
}

function getProfessorInfo (url) {
  return new Promise((resolve, reject) => {
    let results = [];
    let parser = new DOMParser();

    request({
      url: url,
      headers: { 'Content-Type': 'text/html' },
      method: 'GET'
    }, (error, response, body) => {
      if (error) {
        reject(error);
      }
      results.push(...parseProfessorInfo(parser.parseFromString(body, "text/html")));
      resolve(results);
    });
  });

}

function parseProfessorLink (listings) {
  if (!listings) {
    return null;
  }
  return listings.map(listing => {
    return 'www.ratemyprofessor.com' +
           listing.firstElementChild.getAttribute('href');
  });
}

function parseProfessorInfo (DOM) {
  let ratingsDiv = Array.from(DOM.getElementsByClassName('breakdown-wrapper'));
  if (!ratingsDiv) {
    return null;
  }
  let info = {};
  [ info.first, , info.last ] = Array.from(DOM.querySelector('h1 .profname').childNodes);
  [info.quality, info.difficulty, ,] = Array.from(DOM.getElementsByClassName('grade'));
  return info;
}
