import request from 'browser-request';

export function getProfessorLink (url) {
  return new Promise((resolve, reject) => {
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
      let DOM = new DOMParser().parseFromString(response.body, 'text/html');
      let urlPath = DOM.querySelector('a[href*="ShowRating"]').getAttribute('href');
      if (!urlPath) {
        resolve(null);
      }
      resolve(`http://www.ratemyprofessors.com${urlPath}`)
    });
  });
}

export function getProfessorInfo (url) {
  return new Promise((resolve, reject) => {
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
      let DOM = new DOMParser().parseFromString(response.body, 'text/html');
      let ratingsDiv = Array.from(DOM.getElementsByClassName('breakdown-wrapper'));
      if (!ratingsDiv) {
        resolve(null);
      }
      let profInfo = {};
      let profName = DOM.querySelector('.profname');
      let profGrades = DOM.querySelectorAll('.breakdown-wrapper .grade');
      profInfo.first = profName.querySelector('.pfname').innerText.trim();
      profInfo.last = profName.querySelector('.plname').innerText.trim();
      profInfo.quality = profGrades[0].innerText.trim();
      profInfo.easiness = profGrades[2].innerText.trim();
      profInfo.url = url;
      resolve(profInfo);
    });
  });
}
