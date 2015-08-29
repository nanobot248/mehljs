/**
  Provides a class for e-mail parsing.
  
  @module mail
*/

"use strict";

var MimeTypeRegistry = require("./mime_type_registry");
var BasicMimeTypes = require("./basic_mime_types");
BasicMimeTypes.register();

var MimeEntity = require("./mime_entity");
var Headers = require("./headers");

var headerBodySeparator = "\r\n\r\n";

/**
  Class for parsing e-mail data.
  
  @class Mail
  @constructor
  
  @param text {String} The e-mail text to be parsed. If this is not a string,
    it is converted to a string using its toString method.
*/
var Mail = function(text) {
  /**
    The original text of the e-mail.
    @property text
    @type string
  */
  this.text = typeof(text) === "string" ? text : text.toString();
  
  /**
    The e-mail headers. This property is guaranteed to be not null.
    @property headers
    @type {Headers}
  */
  this.headers = null;
  
  /**
    The e-mail body. The type depends on the content type of the e-mail.
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
  
  /**
    Get the original text of the e-mail.
    
    @method
    @return The original text parsed by this e-mail object.
  */
  this.toString = function() {
    return this.text;
  }
};

module.exports = Mail;
