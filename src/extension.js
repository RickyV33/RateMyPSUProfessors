'use strict';

import { searchProfessors, getProfessorInfo } from './rateMyProfessor';
import { uniq } from 'lodash';

document.addEventListener('DOMContentLoaded', onInit(), false);

function onInit () {
  let dataTable = document.querySelector('.datadisplaytable');
  if (dataTable && dataTable.getAttribute('summary').includes('sections')) {
    let tableBody = dataTable.querySelector('tbody');
    let professorNames = getProfessorNames(tableBody);
    addClassNames(tableBody);
    // Initialize cells
    updateHeader(tableBody);
    return true;
    addLoadingPlaceholders(tableBody);
    searchProfessors(professorNames).then(urls => {
      return getProfessorInfo(urls, professorNames);
    }).then(profInfo => {
      updateRows(tableBody, profInfo);
    }).catch(error => {
      console.error(error);
    });
  }
}

function addClassNames (tableBody) {
  let sectionNameInfoRow, sectionNameRow, headerRow;
  let sectionName = Array.from(tableBody.querySelectorAll('.ddtitle'));
  sectionName.forEach(name => {
    sectionNameInfoRow = sectionNameRow = headerRow = name.parentNode;
    do {
      sectionNameInfoRow = sectionNameInfoRow.previousSibling;
      // eslint-disable-next-line
    } while (sectionNameInfoRow.nodeType === Node.TEXT_NODE);
    do {
      headerRow = headerRow.nextSibling;
      // eslint-disable-next-line
    } while (headerRow.nodeType === Node.TEXT_NODE);
    sectionNameInfoRow.classList.add('skip');
    sectionNameRow.classList.add('skip');
    headerRow.classList.add('header');
  });
}

function updateHeader (tableBody) {
  Array.from(tableBody.getElementsByClassName('header')).forEach(header => {
    let rateMyProfessorColumn = document.createElement('th');
    let teacherColumn = header.querySelector('th:nth-child(20)');
    rateMyProfessorColumn.appendChild(document.createTextNode('Rate My Professor'));
    rateMyProfessorColumn.classList.add('ddheader');
    header.insertBefore(rateMyProfessorColumn, teacherColumn);
  });
}

function addLoadingPlaceholders (tableBody) {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));

  contentRows.forEach(row => {
    let gif = document.createElement('img');
    // eslint-disable-next-line
    gif.src = chrome.extension.getURL('images/gears.gif');
    gif.style.display = 'block';
    gif.style.margin = 'auto';
    let gifDiv = insertIntoDiv(gif);
    gifDiv.classList.add('gifDiv');
    row.insertBefore(gifDiv, row.querySelector('td:nth-child(19)'));
  });
}

function getProfessorNames (tableBody) {
  let teacherNameList = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4) td:nth-child(18)'));
  return uniq(teacherNameList.map(element => {
    return element.innerText;
  })).map(name => {
    return parseFirstAndLast(name);
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
function updateRows (tableBody, info) {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));

  contentRows.forEach(row => {
    populateRateMyProfessorCell(row, info);
  });
}

function populateRateMyProfessorCell (row, teacher) {
  let professorName = parseFirstAndLast(row.querySelector('td:nth-child(18)').innerText);
  let info = teacher[professorName.last][professorName.first].info;
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
  let gifDiv = row.querySelector('.gifDiv');
  gifDiv.parentNode.replaceChild(contentCell, gifDiv);
}

function insertIntoDiv (...elements) {
  let div = document.createElement('div');
  elements.forEach(element => {
    div.appendChild(element);
  });
  return div;
}

function addChildren (parent, ...children) {
  children.forEach(child => {
    parent.appendChild(child);
  });
  return parent;
}

