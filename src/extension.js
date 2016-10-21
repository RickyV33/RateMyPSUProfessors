import { getProfessorLinks, getProfessorInfo } from './pagination';
import request from 'browser-request';
import { uniq } from 'lodash';

let tableBody = document.querySelector('.datadisplaytable tbody');

function getTeacherNames () {
  let teacherNameList = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4) td:nth-child(18)'));

  return Promise.resolve(uniq(teacherNameList.map(name => {
    return name.innerText;
  })).map(name => {
    name = name.split(' ');
    // Remove the (P) tag from the name
    let isPrimaryTeacherIndex = name.indexOf('(P)');
    if (isPrimaryTeacherIndex > -1) {
      name.pop();
    }
    // Returns only the first and last name - excluding the middle (if it
    // exists)
    let first = name.shift();
    let last = name.pop();
    return {
      first: first,
      last: last
    };
  }));
}

function updateHeaderColumn () {
  let rateMyProfessorColumn = document.createElement('th');
  let ratingText = document.createTextNode('Rate My Professor');
  let headers = tableBody.querySelector('tr:nth-child(3)');
  let teacherColumn = headers.querySelector('th:nth-child(20)');
  rateMyProfessorColumn.appendChild(ratingText);
  rateMyProfessorColumn.classList.add('ddheader');
  headers.insertBefore(rateMyProfessorColumn, teacherColumn);
}

function updateContentColumns (teacher) {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));

  contentRows.forEach((row, i) => {
    let contentColumn = document.createElement('td');
    let quality = insertIntoDiv(document.createTextNode(teacher[i].quality));
    let easiness = insertIntoDiv(document.createTextNode(teacher[i].easiness));
    let link = document.createElement('a');
    contentColumn.setAttribute('style', 'font-size: .75em');
    contentColumn.classList.add('dddefault');
    link.setAttribute('href', teacher[i].url);
    link.appendChild(document.createTextNode('More info...'));
    link = insertIntoDiv(link);
    addChildren(contentColumn, quality, easiness, link);
    row.insertBefore(contentColumn, row.querySelector('td:nth-child(19)'));
  });
}

function insertIntoDiv (element) {
  let div = document.createElement('div');
  div.appendChild(element);
  return div;
}

function addChildren (parent, ...children) {
  children.forEach(child => {
    parent.appendChild(child);
  });
}

function onInit () {
  updateHeaderColumn();
  getTeacherNames().then(names => {
    return getRateMyProfessorInfo(names)
  }).then(teacherInfo => {
    console.log(teacherInfo);
  });
}

function getRateMyProfessorInfo (teacherNames) {
  let info = {};

  return new Promise((resolve, reject) => {
    function getTeacherInfo (names) {
      if (names.length === 0) {
        resolve(info);
      } else {
        let name = names.pop();
        request({
          url: 'https://cortana-center.herokuapp.com/RateMyProfessor',
          qs: {
            first: name.first,
            last: name.last
          },
          headers: { 'Content-Type': 'text/html' },
          method: 'GET'
        }, (error, response, body) => {
          if (error) {
            reject(error);
          }
          info = Object.assign(info, body);
          // info = {...info, ...body};
          getTeacherInfo(names);
        });
      }
    }

    getTeacherInfo(teacherNames);
  });
}

// fires when script is first loaded
// can't do onInit directly here, because the DOM hasn't been loaded yet
// we just set an event listener for document.DOMContentLoaded
document.addEventListener('DOMContentLoaded', onInit(), false);
