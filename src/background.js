import request from 'browser-request';

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  if (req.action === 'getTeacherLinks') {
    request(req.options, (error, response, body) => {
      if (error) {
        callback({error: error, response: reponse, body: body});
      }
      callback(body);
    });
  } else if (req.action === 'getTeacherInfo') {
    request(req.options, (error, response, body) => {
      if (error) {
        callback({error: error, response: reponse, body: body});
      }
      callback(body);
    });
  }
  return true;
});

