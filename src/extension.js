'use strict';

import { searchProfessors, getInstructorsInfo } from './rateMyProfessor';
import { uniq } from 'lodash';

document.addEventListener('DOMContentLoaded', onInit(), false);

function onInit () {
  let dataTable = document.querySelector('.datadisplaytable');
  if (dataTable && dataTable.getAttribute('summary').includes('sections')) {
    let tableBody = dataTable.querySelector('tbody');
    addClassNames(tableBody);
    let instructorNames = getInstructorNames(tableBody);
    // Initialize cells
    updateHeader(tableBody);
    addLoadingPlaceholders(tableBody);
    searchProfessors(instructorNames).then(urls => {
      return getInstructorsInfo(urls, instructorNames);
    }).then(profInfo => {
      updateRows(tableBody, profInfo);
    }).catch(error => {
      console.error(error);
    });
  }
}

function getInstructorNames (tableBody) {
  return uniq(Array.from(tableBody.querySelectorAll('.instructor td:nth-child(18)'))
                    .map(element => {
                      return element.innerText;
                    })).map(name => {
                      return parseFirstAndLast(name);
                    });
}

function addClassNames (tableBody) {
  let sectionNameInfoRow, sectionNameRow, headerRow;
  Array.from(tableBody.querySelectorAll('.ddtitle')).forEach(name => {
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
  Array.from(tableBody.querySelectorAll('tr:not(.skip):not(.header)'))
        .forEach(instructorRow => {
          instructorRow.querySelector('td:nth-child(19)').classList.add('date');
          instructorRow.classList.add('instructor');
        });
}

function updateHeader (tableBody) {
  Array.from(tableBody.getElementsByClassName('header')).forEach(header => {
    let rateMyProfessorCell = document.createElement('th');
    let dateCell = header.querySelector('th:nth-child(20)');
    rateMyProfessorCell.appendChild(document.createTextNode('Rate My Professor'));
    rateMyProfessorCell.classList.add('ddheader');
    header.insertBefore(rateMyProfessorCell, dateCell);
  });
}

function addLoadingPlaceholders (tableBody) {
  Array.from(tableBody.querySelectorAll('.instructor')).forEach(row => {
    let gif = document.createElement('img');
    // eslint-disable-next-line
    gif.src = chrome.extension.getURL('images/gears.gif');
    gif.style.display = 'block';
    gif.style.margin = 'auto';
    let gifDiv = insertIntoDiv(gif);
    gifDiv.classList.add('gifDiv');
    row.insertBefore(gifDiv, row.querySelector('.date'));
  });
}

function parseFirstAndLast (name) {
  // If there are multiple instructor names in a cell separeted by a comman,
  // only take the first one.
  name = name.split(',')[0].split(' ');
  // Remove the (P) tag from the name
  if (name.indexOf('(P)') > -1) {
    name.pop();
  }
  // Returns only the first and last name - excluding the middle name (if it
  // exists)
  let first = name.shift();
  let last = first === 'TBA' ? 'TBA' : name.pop();
  return {
    first: first,
    last: last
  };
}
function updateRows (tableBody, info) {
  Array.from(tableBody.getElementsByClassName('instructor')).forEach(instructorRow => {
    populateRateMyProfessorCell(instructorRow, info);
  });
}

function populateRateMyProfessorCell (row, instructor) {
  let instructorName = parseFirstAndLast(row.querySelector('td:nth-child(18)').innerText);
  let info = instructor[instructorName.last][instructorName.first].info;
  let contentCell = document.createElement('td');
  contentCell.setAttribute('style', 'font-size: .72em');
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
  parent.cloneNode(true);
  children.forEach(child => {
    parent.appendChild(child);
  });
  return parent;
}

