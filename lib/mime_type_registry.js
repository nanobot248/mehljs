/**
  This module provides a class for managing mime type handlers. This module
  creates a global object mehljs.mimeTypeHandlers of type
  {{#crossLink "MimeTypeRegistry"}}{{/crossLink}} so other classes have a
  centralized registry for mime type handlers.
  
  @module mime_type_registry
*/

"use strict";

/**
  Class for managing mime type handlers. Handlers can be registered so
  content types can be handled.
  
  @class MimeTypeRegistry
*/
var MimeTypeRegistry = function() {
  var self = this;
  
  /**
    An object with the major types as keys. There is a default type "*" that
    maps to text/plain by default.
    Each key maps to another object. The other object uses the subtype names
    as keys. Each pair type/subtype maps to a function. Calling this function
    returns the mime type handler class.
    
    @property typeHandlers
    @type {Array}
  */
  this.typeHandlers = {
    "*": function() { return require("./mime_types/text/plain.js"); }
  };
  
  function addType(type) {
    if(self.typeHandlers[type] == null) {
      self.typeHandlers[type] = {
        "*": function() { return require("./mime_types/text/plain.js"); }
      };
    }
  };
  
  /**
    Get the handler retrieval function f for the given type/subtype
    combination. To get the handler class, call f. This allows to load modules
    using "require" only if the modules are actually needed.
    
    @method handler
    @param type {String} The main type (application, text, image, video, ...)
    @param subtype {String} The subtype (plain, html, ...)
    @return {function} Always returns a function (either the default handler
      retrieval function or one specific for the requested type).
  */
  this.handler = function(type, subtype) {
    if(type == null || type === "*" || this.typeHandlers[type] == null) {
      return this.typeHandlers["*"];
    } else if(subtype == null || subtype === "*" || this.typeHandlers[type][subtype] == null) {
      return this.typeHandlers[type]["*"];
    } else {
      return this.typeHandlers[type][subtype];
    }
  };
  
  /**
    Handle the given message object. A message object is any object that
    contains a property headers of type {{#crossLink "Headers"}}{{/crossLink}}
    and a property body. The body must be a string.
    
    @method handleMessage
    @param message {object} An object containing the properties "headers" and 
      "body".
    @return Returns an instance of the handler that was registered to handle
      the message's content type.
  */
  this.handleMessage = function(message) {
    if(message.headers != null) {
      var indexedHeaders = message.headers.indexedFields();
      if(indexedHeaders["Content-Type"] != null) {
        var contentType = indexedHeaders["Content-Type"];
        contentType = contentType != null && contentType.length > 0 ? contentType[0] : null;
        if(contentType != null) {
          var Handler = self.handler(contentType.type, contentType.subType)();
          var handler = new Handler(message);
          return handler;
        }
      }
    }
    
    return this.typeHandlers["*"];
  };
  
  /**
    Sets the handler retrieval function for the given mime type
    type/subtype.
    
    @method setHandler
    @param type {String} The main type
    @param subtype {String} The subtype
    @param handler {function} A handler retrieval function that returns the
      handler class when called.
  */
  this.setHandler = function(type, subtype, handler) {
    if(self.typeHandlers[type] == null) {
      addType(type);
    }
    self.typeHandlers[type][subtype] = handler;
  };
};

module.exports = MimeTypeRegistry;

global["mehljs"] = global["mehljs"] == null ? {} : global["mehljs"];
global["mehljs"].mimeTypeHandlers = new MimeTypeRegistry();
