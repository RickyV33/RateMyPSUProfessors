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

function updateHeaderColumn() {
  let rateMyProfessorColumn = document.createElement('th');
  let ratingText = document.createTextNode('Rate My Professor');
  rateMyProfessorColumn.appendChild(ratingText);
  rateMyProfessorColumn.classList.add('ddheader');
  let headers = tableBody.querySelector('tr:nth-child(3)');
  let teacherColumn = headers.querySelector('th:nth-child(20)');
  headers.insertBefore(rateMyProfessorColumn, teacherColumn);
}

function updateContentColumns() {
  let contentRows = Array.from(tableBody.querySelectorAll('tr:nth-child(n+4)'));
  contentRows.forEach(row => {
    let column = document.createElement('td');
    let quality = insertIntoDiv(document.createTextNode('Quality: 4.0'));
    let difficulty = insertIntoDiv(document.createTextNode('Difficulty: 3.3'));
    let link = insertIntoDiv(document.createElement('a'));
    column.setAttribute('style', 'font-size: .75em');
    link.setAttribute('href', 'www.google.com');
    link.appendChild(document.createTextNode('More info...'));
    addChildren(column, quality, difficulty, link);
    column.classList.add('dddefault');
    row.insertBefore(column, row.querySelector('td:nth-child(19)'));
  });
}

function insertIntoDiv(element) {
  return document.createElement('div').appendChild(element);
}

function addChildren(parent, ...children) {
  parent.appendChild(children);
}
updateHeaderColumn();
updateContentColumns();


