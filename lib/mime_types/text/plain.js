/**
  Module for handling the text/plain MIME type.
  
  @module text_plain
*/

/**
  Class for handling the text/plain MIME type.
  
  @class TextPlain
  @constructor
*/
var TextPlain = function(message) {
  /**
    The parent object that contains this object.
    
    @property parent
  */
  this.parent = message;
  
  /**
    The content of the plaintext body.
    
    @property content {String}
  */
  this.content = message.body;
};

module.exports = TextPlain;
