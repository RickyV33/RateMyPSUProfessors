import request from 'browser-request';

// eslint-disable-next-line
chrome.runtime.onMessage.addListener((req, sender, callback) => {
  if (req.action === 'xhr') {
    request(req.options, (error, response, body) => {
      if (error) {
        callback({
          error: error,
          response: response
        });
      }
      callback({body: body, response: response, name: req.name});
    });
    // Lets the callback finish before continuing 
    return true;
  }
});

