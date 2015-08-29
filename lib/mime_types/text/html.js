/**
  Module for handling basic MIME type text/html.
  
  @module text_html
*/


/**
  Class for handling the text/html MIME type.
  
  @class TextHtml
  @constructor
*/
var TextHtml = function(message) {
  /**
    The parent object of this object.
    
    @property parent
  */
  this.parent = message;

  /**
    The content of the html message. Currently only a simple string.
    
    @property content {String}
  */
  this.content = message.body;
};

module.exports = TextHtml;
