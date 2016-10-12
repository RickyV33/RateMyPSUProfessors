let tableBody = document.querySelector('.datadisplaytable tbody');

function getTeacherNames () {
  let teacherNameList = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4) td:nth-child(18)'));

  teacherNameList = teacherNameList.map(name => {
    let isPrimaryTeacherIndex;
    let teacherName = name.innerText;
    isPrimaryTeacherIndex = teacherName.indexOf('(');
    if (isPrimaryTeacherIndex > -1) {
      return teacherName.slice(0, isPrimaryTeacherIndex - 1);
    }
    return teacherName;
  });

  return teacherNameList;
}

getTeacherNames();

// This layout table is used to present the sections found

let child;
let parent;
let column;
let ratingText;
//
//
// column = document.createElement('th');
// ratingText = document.createTextNode('COLUMN');
// column.appendChild(ratingText);
// column.classList.add('ddheader');
//
// parent = document.querySelector('.datadisplaytable tbody tr:nth-child(3)');
// child = parent.querySelector('th:nth-child(19)');
// parent.insertBefore(column, child);
//
// column = document.createElement('td');
// ratingText = document.createTextNode('COLUMN');
// column.appendChild(ratingText);
// column.classList.add('dddefault');
//
//
// parent = document.querySelector('.datadisplaytable tbody tr:nth-child(4)');
// child = parent.querySelector('td:nth-child(18)');
// parent.insertBefore(column, child);
//
// column = document.createElement('td');
// ratingText = document.createTextNode('COLUMN');
// column.appendChild(ratingText);
// column.classList.add('dddefault');
//
// parent = document.querySelector('.datadisplaytable tbody tr:nth-child(5)');
// child = parent.querySelector('td:nth-child(18)');
// parent.insertBefore(column, child);