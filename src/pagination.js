'use strict';

export function searchProfessors (names) {
  return new Promise((resolve, reject) => {
    let professors = {};

    function getURL(names, i) {
      if (!names[i]) {
        resolve(professors);
      } else {
        let first = {};
        let professor = {};
        let url = `http://www.ratemyprofessors.com/search.jsp?query=portland+state+university+${names[i].first}+${names[i].last}`;
        first[names[i].first] = {info: null};
        professor[names[i].last] = first;
        chrome.runtime.sendMessage({
          action: 'searchProfessors',
          options: {
            url: url,
            method: 'GET',
          }
        }, response => {
          if (response.error) {
            reject(response.error);
          }
          let DOM = new DOMParser().parseFromString(response.body, 'text/html');
          let urlPath = DOM.querySelector('a[href*="ShowRating"]');
          if (urlPath) {
            professor[names[i].last][names[i].first].info = {url: `http://www.ratemyprofessors.com${urlPath.getAttribute('href')}`};
          }
          professors = Object.assign({}, professors, professor);
          getURL(names, ++i);
        });
      }
    }

    getURL(names, 0);
  });
}

export function getProfessorInfo (urls, names) {
  return new Promise((resolve, reject) => {
    let professors = Object.assign({}, urls);

    function getInfo(names, i) {
      if (!names[i]) {
        resolve(professors);
      } else {
        let professor = professors[names[i].last][names[i].first];
        if (professor.info) {
          chrome.runtime.sendMessage({
            action: 'getProfessorInfo',
            options: {
              url: professor.info.url,
              method: 'POST',
            }
          }, response => {
            if (response.error) {
              reject(response.error);
            }
            let DOM = new DOMParser().parseFromString(response.body, 'text/html');
            let ratingsDiv = Array.from(DOM.getElementsByClassName('breakdown-wrapper'));
            if (ratingsDiv) {
              let profInfo = {};
              let profName = DOM.querySelector('.profname');
              let profGrades = DOM.querySelectorAll('.breakdown-wrapper .grade');
              profInfo.first = profName.querySelector('.pfname').innerText.trim();
              profInfo.last = profName.querySelector('.plname').innerText.trim();
              profInfo.quality = profGrades[0].innerText.trim();
              profInfo.easiness = profGrades[2].innerText.trim();
              profInfo.url = professor.info.url;
              professor.info = Object.assign({}, professor.info, profInfo);
              Object.assign(professors, urls);
              getInfo(names, ++i);
            }
          });
        } else {
          getInfo(names, ++i);
        }
      }
    }
    getInfo(names, 0);
  });
}
