/**
  Provides a class for parsing e-mail headers.
  
  @module headers
*/

"use strict";

var Header = require("./header");

var foldingRegex = /\r\n[ \t]+/g

/**
  Class for parsing and handling e-mail headers.
  
  @class Headers
  @constructor
*/
var Headers = function(text) {
  /**
    An array of header fields in the top-down order (fields[0] is the
    first header line, fields[1] the second header when reading from top
    left to bottom right).
    The elements are of type {{#crossLink "Header"}}{{/crossLink}}
    
    @property fields
    @type {Array}
  */
  this.fields = [];

  var _indexedFields = null;
  
  /**
    Get an object containing all header fields indexed by their field name.
    Each element is an array and contains all the occurrences of header fields
    with the same name in top-down order.
    The indexedFields are cached after first processing. Right now, there is
    no invalidation mechanism. So changing any headers may result in
    unpredictable behaviour.
    
    @method indexedFields
    @return {object} An object containing the header fields indexed by their
      name.
  */
  this.indexedFields = function() {
    if(_indexedFields == null) {
      var result = {};
      for(var i = 0; i < this.fields.length; i++) {
        var field = this.fields[i];
        if(result[field.name] == null) { result[field.name] = []; }
        result[field.name].push(field);
      }
      _indexedFields = result;
    }
    return _indexedFields;
  };
  
  /**
    Get an array of all header fields of the given name. The fields are in
    the same order as the appear in the e-mail (from top to bottom).
    
    @method get
    @return {Array} An array of {{#crossLink "Header"}}{{/crossLink}} elements
      representing the header fields. The value is null if there is no
      header field with the given name.
  */
  this.get = function(name) {
    var result = (this.indexedFields())[name];
    return result;
  };
  
  /**
    Get the first (starting from top of the mail) header field of the
    given name.
    
    @method first
    @return {Header} Returns a single {{#crossLink "Header"}}{{/crossLink}}
      element. If no header with the given field name was found, null
      is returned.
  */
  this.first = function(name) {
    var result = (this.indexedFields())[name];
    return result == null || result.length < 1 ? null : result[0];
  };
  
  if(text != null && text.length > 0) {
    // do this using a closure to ensure all local variables are cleared
    (function(text, fields) {
      var lines = text.split("\r\n");
      for(var i = 0; i < lines.length; i++) {
        var header = new Header(i, lines[i]);
        fields.push(header);
      }
    })(text.replace(foldingRegex, ""), this.fields);
  }
};

module.exports = Headers;
