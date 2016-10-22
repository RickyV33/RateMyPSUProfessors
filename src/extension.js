import { getProfessorLink, getProfessorInfo } from './pagination';
import { uniq } from 'lodash';


let tableBody = document.querySelector('.datadisplaytable tbody');

function parseFirstAndLast (name) {
  name = name.split(' ');
  // Remove the (P) tag from the name
  let isPrimaryTeacherIndex = name.indexOf('(P)');
  if (isPrimaryTeacherIndex > -1) {
    name.pop();
  }
  // Returns only the first and last name - excluding the middle (if it
  // exists)
  return [name.shift(), name.pop()]
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

function populateRateMyProfessorRow (info, row) {
  let contentColumn = document.createElement('td');
  let quality = insertIntoDiv(document.createTextNode(`Quality: ${info.quality}`));
  let easiness = insertIntoDiv(document.createTextNode(`Easiness: ${info.easiness}`));
  let link = document.createElement('a');
  contentColumn.setAttribute('style', 'font-size: .75em');
  contentColumn.classList.add('dddefault');
  link.setAttribute('href', info.url);
  link.setAttribute('target', '_blank');
  link.appendChild(document.createTextNode('More info...'));
  link = insertIntoDiv(link);
  addChildren(contentColumn, quality, easiness, link);
  row.insertBefore(contentColumn, row.querySelector('td:nth-child(19)'));
}

function updateContentColumns () {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));

  contentRows.forEach(row => {
    let [first, last] = parseFirstAndLast(row.querySelector('td:nth-child(18)').innerText);
    let url = `http://www.ratemyprofessors.com/search.jsp?query=portland+state+university+${first}+${last}`;
    getProfessorLink(url).then(link => {
      if (!link) {
        console.log('no link');
      }
      return getProfessorInfo(link);
    }).then(info => {
      populateRateMyProfessorRow(info, row);
    });
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
  updateContentColumns();

}

// fires when script is first loaded
// can't do onInit directly here, because the DOM hasn't been loaded yet
// we just set an event listener for document.DOMContentLoaded
document.addEventListener('DOMContentLoaded', onInit(), false);

