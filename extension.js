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

let column = document.createElement('th');
// let columnList = Array.prototype.slice.call(document.querySelectorAll('.datadisplaytable tbody tr:nth-child(3) td'));
let ratingText = document.createTextNode('lkdjflkjdfj');
column.appendChild(ratingText);
column.classList.add('ddheader');
// let length = columnList.length;
let c;

let parent = document.querySelector('.datadisplaytable tbody tr:nth-child(3)');
console.log(parent);
c = parent.querySelector('th:nth-child(18)');
console.log(c);
parent.insertBefore(column, c);
