import { getProfessorLink, getProfessorInfo } from './pagination';
import { uniq } from 'lodash';

document.addEventListener('DOMContentLoaded', onInit(), false);

function onInit () {
  let table = document.querySelector('.datadisplaytable');
  if (table.getAttribute('summary').includes('sections')) {
    let tableBody = table.querySelector('tbody');
    console.log(getTeacherNames(tableBody));
    updateHeader(tableBody);
    updateRows(tableBody);
  }
}

function getTeacherNames (tableBody) {
  let teacherNameList = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4) td:nth-child(18)'));
  return uniq(teacherNameList.map(element => {
    return element.innerText;
  })).map(name => {
    return parseFirstAndLast(name);
  });
}

function updateHeader (tableBody) {
  let rateMyProfessorColumn = document.createElement('th');
  let tableHeaders = tableBody.querySelector('tr:nth-child(3)');
  let teacherColumn = tableHeaders.querySelector('th:nth-child(20)');
  rateMyProfessorColumn.appendChild(document.createTextNode('Rate My Professor'));
  rateMyProfessorColumn.classList.add('ddheader');
  tableHeaders.insertBefore(rateMyProfessorColumn, teacherColumn);
}

function updateRows (tableBody) {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));

  contentRows.forEach(row => {
    let name = parseFirstAndLast(row.querySelector('td:nth-child(18)').innerText);
    let url = `http://www.ratemyprofessors.com/search.jsp?query=portland+state+university+${name.first}+${name.last}`;
    getProfessorLink(url).then(link => {
      return getProfessorInfo(link);
    }).then(info => {
      populateRateMyProfessorCell(info, row);
    });
  });
}

function parseFirstAndLast (name) {
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
}

function populateRateMyProfessorCell (info, row) {
  let contentCell = document.createElement('td');
  contentCell.setAttribute('style', 'font-size: .75em');
  contentCell.classList.add('dddefault');
  if (!info) {
    let noInfo = insertIntoDiv(document.createTextNode('N/A'));
    contentCell = addChildren(contentCell, noInfo);
  } else {
    let quality = insertIntoDiv(document.createTextNode(`Quality: ${info.quality}`));
    let easiness = insertIntoDiv(document.createTextNode(`Easiness: ${info.easiness}`));
    let link = document.createElement('a');
    link.setAttribute('href', info.url);
    link.setAttribute('target', '_blank');
    link.appendChild(document.createTextNode('More info...'));
    link = insertIntoDiv(link);
    contentCell = addChildren(contentCell, quality, easiness, link);
  }
  row.insertBefore(contentCell, row.querySelector('td:nth-child(19)'));
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

