/**
  This module provides a class for handling a multipart message.
  
  @module mime_entity
*/
var Headers = require("./headers");
var MimePart = require("./mime_part");
var MimeTypeRegistry = require("./mime_type_registry");
var BasicMimeTypes = require("./basic_mime_types");

var headerBodySeparator = "\r\n\r\n";

/**
  This class represents a multipart MIME message. It is used as the body
  of multipart {{#crossLink "Mail"}}{{/crossLink}} messages and multipart
  {{#crossLink "MimePart"}}{{/crossLink}} objects.
  
  @class MimeEntity
  @constructor
  @param text {string} The text of the entity.
  @param subtype {string} The MIME subtype (alternative, mixed, related, ...).
  @param boundary {string} The boundary as given in the Content-Type of the
    mail message or mime part.
*/
var MimeEntity = function(text, subtype, boundary) {
  /**
    The text of the MIME entity.
    
    @property text {string}
  */
  this.text = typeof(text) === "string" ? text : text.toString();
  
  /**
    The subtype of the MIME entity (mixed, related, alternative, ...)
    
    @property subtype {string}
  */
  this.subtype = subtype;
  
  /**
    The MIME boundary as provided in the message's Content-Type header.
    
    @property boundary {string}
  */
  this.boundary = boundary;
  
  /**
    The {{#crossLink "MimePart"}}{{/crossLink}} objects of this MIME entity.
    
    @property parts {Array}
  */
  this.parts = [];
  
  (function(text, subtype, boundary, parts) {
    var textParts = text.split("--" + boundary);
    for(var i = 0; i < textParts.length; i++) {
      if(i === textParts.length - 1) {
        if(textParts[i].length < "--\r\n".length || textParts[i].substring(0, "--\r\n".length) !== "--\r\n") {
          throw new Error("Mime multipart message doesn't end with --: \"" + textParts[i] + "\"");
        }
      } else {
        var part = new MimePart(textParts[i]);
        parts.push(part);
      }
    }
  })(this.text, this.subtype, this.boundary, this.parts);  
};

module.exports = MimeEntity;
