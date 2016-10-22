import request from 'browser-request';

chrome.runtime.onMessage.addListener(function (req, sender, callback) {
  if (req.action === 'getProfessorLink') {
    console.log('hi');
    request(req.options, (error, response, body) => {
      error = true;
      if (error) {
        callback({
          error: error,
          response: response
        });
      }
      callback(body);
    });
  } else if (req.action === 'getProfessorInfo') {
    request(req.options, (error, response, body) => {
      if (error) {
        callback({
          error: error,
          response: response
        });
      }
      callback(body);
    });
  }
  return true;
});

