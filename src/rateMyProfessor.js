'use strict';

export function searchProfessors (names) {
  return new Promise((resolve, reject) => {
    let instructors = {};
    let length = names.length;
    let completeCounter = 0;
    names.forEach(name => {
      let first = {};
      let instructor = {};
      let url = `http://www.ratemyprofessors.com/search.jsp?query=portland+state+university+${name.first}+${name.last}`;
      first[name.first] = {info: null};
      // Handles the case where an instructor has the same last name as another
      if (instructors[name.last]) {
        first = Object.assign({}, instructors[name.last], first);
      }
      instructor[name.last] = first;
      instructors = Object.assign({}, instructors, instructor);
      // eslint-disable-next-line
      chrome.runtime.sendMessage({
        action: 'xhr',
        name: name,
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
          instructors[response.name.last][response.name.first].info = {
            url:
              `http://www.ratemyprofessors.com${urlPath.getAttribute('href')}`
          };
        }
        instructors = Object.assign({}, instructors, instructors);
        if (++completeCounter >= length) {
          resolve(instructors);
        }
      });
    });
  });
}

export function getInstructorsInfo (urls, names) {
  return new Promise((resolve, reject) => {
    let instructors = Object.assign({}, urls);
    let completeCounter = 0;
    let instructorNames = names.filter(name => {
      if (instructors[name.last][name.first].info) {
        return name;
      }
    });
    let length = instructorNames.length;
    instructorNames.forEach(name => {
      let instructor = instructors[name.last][name.first];
      // eslint-disable-next-line
      chrome.runtime.sendMessage({
        action: 'xhr',
        name: name,
        options: {
          url: instructor.info.url,
          method: 'GET'
        }
      }, response => {
        if (response.error) {
          reject(response.error);
        }
        let last = response.name.last;
        let first = response.name.first;
        // eslint-disable-next-line
        let parser = new DOMParser();
        let DOM = parser.parseFromString(response.body, 'text/html');
        // Need to check the grades section before getting the professors grades
        let gradesSectionExists = DOM.querySelector('.breakdown-wrapper');
        if (gradesSectionExists) {
          let grades = gradesSectionExists.querySelectorAll('.grade');
          let info = {};
          info.quality = grades[0].innerText.trim();
          info.easiness = grades[2].innerText.trim();
          instructors[last][first].info = Object.assign({}, info, instructors[last][first].info);
        } else {
          instructors[last][first] = Object.assign({}, instructors[last][first], {info: null});
        }
        if (++completeCounter >= length) {
          resolve(instructors);
        }
      });
    });
  });
}

