/**
  Module for handling the image/png MIME type. See
  {{#crossLink "ImageGif"}}{{/crossLink}} for available properties and methods.
  
  @module image_png
*/

var mailUtils = require("../../utils.js");
var buffer = require("buffer");

var ImagePng = function(message) {
  this.parent = message;
  this.headers = message.headers;
  this.content = message.body;
  
  this.type = this.headers.first("Content-Type");
  this.disposition = this.headers.first("Content-Disposition");
  this.contentEncoding = this.type.attributes["charset"];
  this.transferEncoding = this.headers.first("Content-Transfer-Encoding");
  this.transferEncoding = this.transferEncoding == null ? "binary" : this.transferEncoding;
  
  var _imageData = null;
  this.imageData = function(cache) {
    if(_imageData != null) {
      return _imageData;
    } else {
      var result = mailUtils.convert(this.content, this.transferEncoding.value);
      if(typeof(result) === "string") {
        result = new Buffer(result, "binary");
      }
      if(cache === true) {
        _imageData = result;
      }
      return result;
    }
  };
  
  this.clearCache = function() {
    _imageData = null;
  };
};

module.exports = ImagePng;
