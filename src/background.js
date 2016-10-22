import request from 'browser-request';

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  if (req.action === 'getTeacherLinks') {
    request(req.options, (urlerror, response, body) => {
      console.log('this gets the links');
    });
    return true;
  } else if (req.action === 'getTeacherInfo') {
    request(req.options, (urlerror, response, body) => {
      console.log('this gets the info');
    });
    return true;

  }
});

