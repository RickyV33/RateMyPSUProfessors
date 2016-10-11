let classRowIndex = 4;
let teacherIndex = 18;
let teachers = [];
let teacherName;
let totalTeachers = document.querySelectorAll('.datadisplaytable tbody tr').length;

while (totalTeachers >= classRowIndex) {
  let isPrimaryTeacherIndex;

  teacherName = document.querySelector('.datadisplaytable tbody tr:nth-child('
                                       + classRowIndex++ + ') td:nth-child(' + teacherIndex + ')').innerText;
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