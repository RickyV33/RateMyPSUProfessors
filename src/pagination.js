import request from 'browser-request' ;


export default function pagination(url, startAt, maxRestults, step = 20) {
  return new Promise((resolve, reject) => {
    let results = [];
    function getPaginatedData(min, max) {
      if (min >= max) {
        resolve(data);
      }
      request({
        url: url,
        qs: { 'offset': min },
        headers: {
          'Content-Type': 'text/html',
        },
        method: 'GET'
      }, (error, response, body) => {
        if (error) {
          reject(error);
        }
        results.push(body);
        getPaginatedData(min + step, max);
      });
    }
    getPaginatedData(startAt, maxRestults)
  });
}