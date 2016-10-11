const TABLE_COLUMN_START = 2;
const TEACHER_INDEX = 18;
let tableBody = document.querySelector('.datadisplaytable tbody');

function getTeacherNames () {
  let teachers = [];
  let teacherName;
  let isPrimaryTeacherIndex;
  let teacherNames = Arrary.prototype.slice(document.querySelectorAll('.datadisplaytable tbody tr:nth-child(n + 3)'));
  isPrimaryTeacherIndex = teacherName.indexOf('(');
  if (isPrimaryTeacherIndex > -1) {
    teacherName = teacherName.slice(0, isPrimaryTeacherIndex - 1);
  }
  teachers.push(teacherName);
}


let child;
let parent;
let column;
let ratingText;


column = document.createElement('th');
ratingText = document.createTextNode('COLUMN');
column.appendChild(ratingText);
column.classList.add('ddheader');

parent = document.querySelector('.datadisplaytable tbody tr:nth-child(3)');
child = parent.querySelector('th:nth-child(19)');
parent.insertBefore(column, child);

column = document.createElement('td');
ratingText = document.createTextNode('COLUMN');
column.appendChild(ratingText);
column.classList.add('dddefault');


parent = document.querySelector('.datadisplaytable tbody tr:nth-child(4)');
child = parent.querySelector('td:nth-child(18)');
parent.insertBefore(column, child);

column = document.createElement('td');
ratingText = document.createTextNode('COLUMN');
column.appendChild(ratingText);
column.classList.add('dddefault');

parent = document.querySelector('.datadisplaytable tbody tr:nth-child(5)');
child = parent.querySelector('td:nth-child(18)');
parent.insertBefore(column, child);