import request from 'browser-request';

chrome.runtime.onMessage.addListener(function (req, sender, callback) {
  if (req.action === 'getProfessorLink' || req.action === 'getProfessorInfo') {
    request(req.options, (error, response, body) => {
      if (error) {
        callback({
          error: error,
          response: response
        });
      }
      callback({body: body});
    });
    return true;
  }
});

