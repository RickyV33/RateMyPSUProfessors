'use strict';
import request from 'request';


default export function pagination(url, maxRestults) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      qs: {'offset': maxRestults},
      headers: {
        'Content-Type': 'text/html',
      },
      method: 'GET'
    }, (error, response, body) => {
      console.log(body);
    });
  });
}