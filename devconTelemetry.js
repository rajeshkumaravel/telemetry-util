/**
 * @file Manages for sending telemetry API
 * @version 1.0
 */

/**
 * @type {Object}
 * @description : Configuration constants
 */
const CONFIG = {
  TELEMETRY_URL: 'https://devcon.sunbirded.org/content/data/v1/telemetry',
  METHOD: ['POST', 'PUT']
};

/**
 * @param  {String} method  : Request Method
 * @param  {Object} data    : Request body or data
 * @returns {Object}        : _request
 * @throws {Exception}      : If method is invalid
 * @description : Function to construct request object
 */
constructRequestObject = (method, data) => {
  try {
    if (CONFIG.METHOD.indexOf(method) < 0) constructErrorObject('Method Name mismatch', 'Invalid method name - ' + method);
    let _request = new Object();
    _request.url = CONFIG.TELEMETRY_URL;
    _request.type = method;
    _request.data = JSON.stringify(data);
    _request.contentType = 'application/json';
    _request.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': '*'
    };
    return _request;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @param  {Object} data : Request Body for Telemetry API
 * @description : Function to call telemetry API
 */
sendTelemetry = (data, method, cb) => {
  let _callbackRequired = (cb && typeof cb == 'function') ? true : false;
  let _req = constructRequestObject(method, data);
    $.ajax({
      type: _req.type,
      url: _req.url,
      data: _req.data,
      contentType: _req.contentType,
      headers: _req.headers,
      success: (response) => {},
      error: (error) => {
        if (_callbackRequired) cb(error);
      },
      complete: (message) => {
        if (_callbackRequired) cb(null, sendAPISuccess(message));
      },
    });
};

/**
 * @param  {String} name    : Error name
 * @param  {String} message : Error message
 * @throws {Exception}      : Based on name and message
 * @description : Function to create error object and throw exception
 */
constructErrorObject = (name, message) => {
  let _errObject = new Error();
  _errObject.name     = name;
  _errObject.message  = message;
  throw new Error(_errObject);
};

/**
 * @param  {Object} response  : API response (or) Ajax complete callback
 * @returns {Object}          : Constructed response object
 * @description : Function to construct API response
 * 
 */
sendAPISuccess = (response) => {
  return {
    statusCode: response.status ? response.status : null,
    statusText: response.statusText ? response.statusText : null,
    responseJSON: response.responseJSON ? response.responseJSON : null,
    responseText: response.responseText ? response.responseText : null
  };
};

/**
 * @param  {String} `devcon:telemetry:send` : Event name
 * @param  {Function}                       : Callback
 * @description :
 * 1. Event Listener for telemetry API call
 */
window.addEventListener('devcon:telemetry:send', function (data) {
  let _payload = data.detail;
  if (_payload && _payload.hasOwnProperty('data') && _payload.hasOwnProperty('method')) {
    sendTelemetry(_payload.data, _payload.method, (error, response) => {
      if (error) throw new Error(error);
      console.log(response);
    });
  } else {
    throw new Error('Invalid payload for `devcon:telemetry:send` event');
  }
}.bind(this), false);
if (!CONFIG.TELEMETRY_URL) constructErrorObject('CONFIG mismatch', 'Telemetry URL is missing');