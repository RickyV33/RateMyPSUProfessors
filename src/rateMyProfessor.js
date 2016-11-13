'use strict';

export function searchProfessors (names) {
  return new Promise((resolve, reject) => {
    let instructors = {};

    function getURL (names) {
      if (names.length === 0) {
        resolve(instructors);
      } else {
        let name = names.pop();
        let first = {};
        let instructor = {};
        let url = `http://www.ratemyprofessors.com/search.jsp?query=portland+state+university+${name.first}+${name.last}`;
        first[name.first] = {info: null};
        instructor[name.last] = first;
        // eslint-disable-next-line
        chrome.runtime.sendMessage({
          action: 'xhr',
          options: {
            url: url,
            method: 'GET'
          }
        }, response => {
          if (response.error) {
            reject(response.error);
          }
          // eslint-disable-next-line
          let parser = new DOMParser();
          let DOM = parser.parseFromString(response.body, 'text/html');
          let urlPath = DOM.querySelector('a[href*="ShowRating"]');
          if (urlPath) {
            instructor[name.last][name.first].info = {url: `http://www.ratemyprofessors.com${urlPath.getAttribute('href')}`};
          }
          instructors = Object.assign({}, instructors, instructor);
          getURL(names);
        });
      }
    }

    getURL(Array.from(names));
  });
}

export function getInstructorsInfo (urls, names) {
  return new Promise((resolve, reject) => {
    let instructors = Object.assign({}, urls);

    function getInfo (names) {
      if (names.length === 0) {
        resolve(instructors);
      } else {
        let name = names.pop();
        let instructor = instructors[name.last][name.first];
        if (instructor.info) {
            // eslint-disable-next-line
          chrome.runtime.sendMessage({
            action: 'xhr',
            options: {
              url: instructor.info.url,
              method: 'GET'
            }
          }, response => {
            if (response.error) {
              reject(response.error);
            }
            // eslint-disable-next-line
            let parser = new DOMParser();
            let DOM = parser.parseFromString(response.body, 'text/html');
            let profGrades = DOM.querySelectorAll('.breakdown-wrapper .grade');
            if (profGrades) {
              let profInfo = {};
              profInfo.quality = profGrades[0].innerText.trim();
              profInfo.easiness = profGrades[2].innerText.trim();
              profInfo.url = instructor.info.url;
              instructor.info = Object.assign({}, instructor.info, profInfo);
              getInfo(names);
            }
          });
        } else {
          getInfo(names);
        }
      }
    }
    getInfo(Array.from(names));
  });
}

