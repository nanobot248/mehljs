/**
  Provides a class for parsing a single {{#crossLink "Mail"}}{{/crossLink}} or
  {{#crossLink "MimePart"}}{{/crossLink}} header.
  
  @module header
*/

"use strict";

var mailUtils = require("./utils");

var lwspRegex = /^[ \t]*/;
var quotedPairRegex = /\\./g;

function readStringLiteral(text, start) {
  if(text[start] !== "\"") return "";
  start++;
  for(var i = start; i < text.length; i++) {
    var dquoteIndex = text.indexOf("\"", i);
    if(dquoteIndex != null && dquoteIndex >= start) {
      if(text[dquoteIndex - 1] !== "\\") {
        var result = text.substring(start, dquoteIndex);
        result = result.replace(quotedPairRegex, function(esc) { return esc[1]; });
        return result;
      }
    } else {
      throw new Error("Quoted string in header field needs to end with '\"'.");
    }
  }
}

function parseAttributes(text) {
  var result = {};
  var currentIndex = 0;
  for(var i = 0; i < text.length; i++) {
    var spaces = text.match(lwspRegex);
    if(spaces != null && spaces.length > 0) {
      currentIndex += spaces[0].length;
    }
    
    var assignmentIndex = text.indexOf("=", currentIndex);
    
    if(assignmentIndex != null && assignmentIndex >= 0) {
      var name = text.substring(currentIndex, assignmentIndex);
      var value = "";
      
      currentIndex = assignmentIndex + 1;
      var j;
      for(j = currentIndex; j < text.length; j++) {
        var ch = text[j];
        if(ch === "\"") {
          var literal = readStringLiteral(text, j);
          value += literal;
          j += literal.length + 1;
          currentIndex = j;
        } else if(ch === ";") {
          result[name] = value;
          currentIndex = j + 1;
          break;
        } else {
          value += ch;
        }
      }
      if(j >= text.length) {
        result[name] = value;
      }
    } else {
      break;
    }
  }
  return result;
}

/**
  Class for parsing a single {{#crossLink "Mail"}}{{/crossLink}} or
  {{#crossLink "MimePart"}}{{/crossLink}} header.
  
  @class Header
  @constructor
  @param index {integer} The index of the header field, counted from the
    top of the message/MIME-part.
  @param text {string} The full text of the header. The text needs to be
    unfolded already.
*/
var Header = function(index, text) {
  /**
    The index of the header field, counted from the top of the mail/MIME-part.
    
    @property index {integer}
  */
  this.index = index;
  
  /**
    The name of the header (e.g. Content-Type, Content-Disposition, Received,
    ...).
    
    @property name {String}
  */
  this.name = null;
  
  /**
    The value of the haeder field. For special headers like Content-Type
    and Content-Disposition, this is only the main value. For thos headers
    an additional propety "attributes" exists that holds additional attributes
    like "charset", "filename", ...
    
    @property value {string}
  */
  this.value = null;
  
  /**
    Additional named attributes (e.g. "charset" for the Content-Type header,
    or "filename" for the Content-Disposition header).
    
    @property attributes {object}
  */
  this.attributes = null;
  
  /* Use a closure to ensure all variables are freed */
  (function() {
    var colonIndex = text.indexOf(":");
    if(colonIndex != null && colonIndex > 0) {
      this.name = text.substring(0, colonIndex);
      this.value = mailUtils.decodeMimeHeaderValue(text.substring(colonIndex + 1).trim());
    }
    
    if(this.name === "Content-Type") {
      var slashIndex = this.value.indexOf("/");
      this.type = this.value.substring(0, slashIndex);
  
      var semiColonIndex = this.value.indexOf(";", slashIndex + 1);
      if(semiColonIndex == null || semiColonIndex < 0) {
        this.subType = this.value.substring(slashIndex + 1);
        this.attributes = {};
      } else {
        this.subType = this.value.substring(slashIndex + 1, semiColonIndex);
        this.attributes = parseAttributes(this.value.substring(semiColonIndex + 1));
      }
      if(this.attributes["charset"] == null) {
        // prevent any conversion of input data. this ensures that us-ascii
        // data (the rfc822 default) remains us-ascii, but other data (e.g.
        // image data transfered using a content transfer encoding) is also
        // correctly converted.
        this.attributes["charset"] = "binary";
      }
    } else if(this.name === "Content-Disposition") {
      /*
       * Values for the content disposition header can be found at:
       * http://www.iana.org/assignments/cont-disp/cont-disp.xhtml
       */
      var semicolonIndex = this.value.indexOf(";");
      if(semicolonIndex == null || semicolonIndex < 0) {
        this.disposition = {
          type: this.value
        };
      } else {
        this.disposition = {
          type: this.value.substring(0, semicolonIndex)
        };
        var attributes = parseAttributes(this.value.substring(semicolonIndex + 1));
        if(attributes != null) {
          for(var key in attributes) {
            this.disposition[key] = attributes[key];
          }
        }
      }
    }
  }).call(this);
};

module.exports = Header;
