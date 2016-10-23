import request from 'browser-request';

// eslint-disable-next-line
chrome.runtime.onMessage.addListener(function (req, sender, callback) {
  if (req.action === 'searchProfessors' || req.action === 'getProfessorInfo') {
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

