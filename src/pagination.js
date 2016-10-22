import request from 'browser-request';

export function getProfessorLink (url) {
  return new Promise((resolve, reject) => {
    let parser = new DOMParser();
    let DOM;
    let professorURL;
    let urlList;

    chrome.runtime.sendMessage({
      action: 'getProfessorLink',
      options: {
        url: url,
        method: 'GET',
      }
    }, response => {
      if (response.error) {
        reject(response.error);
      }
      DOM = parser.parseFromString(response.body, 'text/html');
      urlList = Array.from(DOM.querySelector('a[href*="ShowRating"]'));
      if (!urlList) {
        resolve(null);
      }
      resolve(urlList.map(urlPath => {
        return `http://www.ratemyprofessors.com${urlPath}`;
      }).shift());
    });
  });
}

export function getProfessorInfo (url) {
  return new Promise((resolve, reject) => {
    let parser = new DOMParser();
    let DOM;

    chrome.runtime.sendMessage({
      action: 'getProfessorInfo',
      options: {
        url: url,
        method: 'POST',
      }
    }, response => {
      if (response.error) {
        reject(response.error);
      }
      DOM = parser.parseFromString(response.body, 'text/html');
      let ratingsDiv = Array.from(DOM.getElementsByClassName('breakdown-wrapper'));
      if (!ratingsDiv) {
        resolve(null);
      }
      let info = {};
      console.log(DOM.querySelector('a[href^="https//www.ratemyprofessors.com"]'));
      let profName = Array.from(DOM.getElementsByClassName('profname')).pop().childNodes;
      console.log(profName);
      // info.first = profName.shift();
      // info.last = profName.pop();
      // [info.quality, info.difficulty, ,] = Array.from(DOM.getElementsByClassName('grade'));
      // resolve(info);
    });
  });

}
