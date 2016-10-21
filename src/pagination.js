// import request from 'browser-request';
//
// export function getProfessorLinks (url) {
//   return new Promise((resolve, reject) => {
//     let parser = new DOMParser();
//
//     request({
//       url: url,
//       headers: { 'Content-Type': 'text/html' },
//       method: 'GET'
//     }, (error, response, body) => {
//       if (error) {
//         reject(error);
//       }
//       resolve(parseProfessorLink(parser.parseFromString(body, 'text/html')));
//     });
//   });
// }
//
// function parseProfessorLink (DOM) {
//   let professors = Array.from(DOM.getElementsByClassName('PROFESSOR'));
//   if (!professors) {
//     return null;
//   }
//   //return 'https://us9.proxysite.com/process.php?d=joV9rFmPUEpTk87STEfBgcJDJGgPmHg8rcq6jxmDs%2BWUFnGpZm4pCWBf%2B0%2F1xO7QTAulyXlq&b=1&f=norefer';
//   return professors.map(listing => {
//     console.log('----->' + listing.firstElementChild.getAttribute('href'));
//     return 'https://www.ratemyprofessor.com' +
//            listing.firstElementChild.getAttribute('href');
//   }).slice(-1).pop();
// }
//
// export function getProfessorInfo (url) {
//   return new Promise((resolve, reject) => {
//     document.domain = 'ratemyprofessor.com';
//     let parser = new DOMParser();
//     request({
//       url: url,
//       headers: { 'Content-Type': 'text/html', 'Origin': 'https://banweb.pdx.edu/pls/oprd/bwskfcls.P_GetCrse' },
//       method: 'GET'
//     }, (error, response, body) => {
//       if (error) {
//         reject(error);
//       }
//       console.log(body);
//       resolve(parseProfessorInfo(parser.parseFromString(body, "text/html")));
//     });
//   });
//
// }
//
// function parseProfessorInfo (DOM) {
//   let ratingsDiv = Array.from(DOM. getElementsByClassName('breakdown-wrapper'));
//
//   if (!ratingsDiv) {
//     return null;
//   }
//   let info = {};
//   [info.first, , info.last] = Array.from(DOM.querySelector('h1.profname').childNodes);
//   [info.quality, info.difficulty, ,] = Array.from(DOM.getElementsByClassName('grade'));
//   return info;
// }
