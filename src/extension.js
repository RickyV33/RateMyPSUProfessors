import { getProfessorLink, getProfessorInfo } from './pagination';
import { uniq, isEmpty } from 'lodash';

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

function updateHeaderColumns (tableBody) {
  let rateMyProfessorColumn = document.createElement('th');
  let tableHeaders = tableBody.querySelector('tr:nth-child(3)');
  let teacherColumn = tableHeaders.querySelector('th:nth-child(20)');
  rateMyProfessorColumn.appendChild(document.createTextNode('Rate My Professor'));
  rateMyProfessorColumn.classList.add('ddheader');
  tableHeaders.insertBefore(rateMyProfessorColumn, teacherColumn);
}

function populateRateMyProfessorRow (info, row) {
  let contentCell = document.createElement('td');
  contentCell.setAttribute('style', 'font-size: .75em');
  contentCell.classList.add('dddefault');
  if (isEmpty(info)) {

  } else {
    let quality = insertIntoDiv(document.createTextNode(`Quality: ${info.quality}`));
    let easiness = insertIntoDiv(document.createTextNode(`Easiness: ${info.easiness}`));
    let link = document.createElement('a');
    link.setAttribute('href', info.url);
    link.setAttribute('target', '_blank');
    link.appendChild(document.createTextNode('More info...'));
    link = insertIntoDiv(link);
    contentCell = addChildren(contentCell, quality, easiness, link);
    row.insertBefore(contentCell, row.querySelector('td:nth-child(19)'));
  }
}

function updateContentColumns (tableBody) {
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
  return parent;
}


function onInit () {
  let tableBody = document.querySelector('.datadisplaytable tbody');
  updateHeaderColumns(tableBody);
  updateContentColumns(tableBody);

}

// fires when script is first loaded
// can't do onInit directly here, because the DOM hasn't been loaded yet
// we just set an event listener for document.DOMContentLoaded
document.addEventListener('DOMContentLoaded', onInit(), false);

