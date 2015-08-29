/**
  Provides a class for handling mime parts.
  
  @module mime_part
*/

var MimeEntity = require("./mime_entity");
var Headers = require("./headers");

var headerBodySeparator = "\r\n\r\n";

/**
  Class for handling mime parts.
  
  @class MimePart
  @constructor
  @param text {String} The text containing the headers and body of the mime part
*/
var MimePart = function(text) {
  /**
    The original text of the mime part.
    
    @property text {String}
  */
  this.text = typeof(text) === "string" ? text : text.toString();
  
  /**
    The {{#crossLink "Headers"}}{{/crossLink}} or the MIME part.
    
    @property headers {Headers}
  */
  this.headers = null;
  
  /**
    The body of the MIME part.
    
    @property body
  */
  this.body = null;
  
  (function(mail) {
    var separationIndex = mail.text.indexOf(headerBodySeparator);
    if(separationIndex == null || separationIndex < 0) {
      mail.headers = new Headers(mail.text);
      mail.body = null;
    } else {
      mail.headers = new Headers(mail.text.substr(0, separationIndex).trimLeft());
      mail.body = mail.text.substr(separationIndex + headerBodySeparator.length);
      mail.body = mehljs.mimeTypeHandlers.handleMessage(mail);
    }
  })(this);
};

module.exports = MimePart;
