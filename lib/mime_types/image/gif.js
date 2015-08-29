/**
  Module for handling the image/gif content type.
  
  @module image_gif
*/

var mailUtils = require("../../utils.js");
var buffer = require("buffer");

/**
  Class for handling the image/gif content type.
  
  @class ImageGif
  @constructor
  @param message An object containing a "headers" and a "body" property.
*/
var ImageGif = function(message) {
  /**
    The parent object of this object.
    
    @property parent
  */
  this.parent = message;
  
  /**
    The headers of this GIF image object.
    
    @property headers {Headers}
  */
  this.headers = message.headers;
  
  /**
    The original content of the image object, before any transformations.
    
    @property content {String}
  */
  this.content = message.body;
  
  /**
    The content type of the containing MIME part or mail.
    
    @property type
  */
  this.type = this.headers.first("Content-Type");
  
  /**
    The content disposition of the containing MIME part or mail.
    
    @property disposition
  */
  this.disposition = this.headers.first("Content-Disposition");
  
  /**
    The content encoding (charset) of provided by the content type.
    
    @property contentEncoding {String}
  */
  this.contentEncoding = this.type.attributes["charset"];
  
  /**
    The transfer encoding of provided by the partent.
    
    @property transferEncoding {String}
  */
  this.transferEncoding = this.headers.first("Content-Transfer-Encoding");
  this.transferEncoding = this.transferEncoding == null ? "binary" : this.transferEncoding;
  
  var _imageData = null;
  
  /**
    Get the image data of this part. The data is retrieved by decoding the
    content using the transfer encoding.
    
    @method imageData
    @param [cache} {Boolean} This is true by default. Determines whether the
      decoded image data should be cached.
    @return {Buffer} Returns the decoded image data as a Buffer object.
  */
  this.imageData = function(cache) {
    if(_imageData != null) {
      return _imageData;
    } else {
      var result = mailUtils.convert(this.content, this.transferEncoding.value);
      if(typeof(result) === "string") {
        result = new Buffer(result, "binary");
      }
      if(cache !== false) {
        _imageData = result;
      }
      return result;
    }
  };
  
  /**
    Clears the cached image data.
    
    @method
  */
  this.clearCache = function() {
    _imageData = null;
  };
};

module.exports = ImageGif;
