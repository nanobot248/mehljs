/**
  Handles the multipart/digest MIME type.
  
  @module multipart_digest
*/

var MimeEntity = require("../../mime_entity");

/**
  Handles the multipart/digest MIME type.
  
  @class MultipartDigest
  @constructor
  @param message An object that contains a "headers" and a "body" property.
*/
var MultipartDigest = function(message) {
  var self = this;

  /**
    This is a multipart object.
    
    @property multipart {Boolean}
  */
  this.multipart = true;
  
  /**
    Determines which type of multipart object this is ("digest").
    
    @property multipartType {String}
  */
  this.multipartType = "digest";
  
  /**
    The pretext of the multipart message. This is the plaintext found before
    the first occurrence of the boundary and is used in e-mails to provide
    a short plaintext message to mail clients that lack support for
    multipart mails.
    
    @property pretext {String}
  */
  this.pretext = "";
  
  /**
    The content of the multipart message. This is a
    {{#crossLink "MimeEntity"}}{{/crossLink}} object.
    
    @property content {MimeEntity}
  */
  this.content = null;
  
  (function(message) {
    var indexedHeaders = message.headers.indexedFields();
    var type = indexedHeaders["Content-Type"];
    type = type != null && type.length > 0 ? type[0] : null;
    
    if(type != null) {
      if(type.type === "multipart" && type.attributes != null &&
        type.attributes["boundary"] != null) {

        var boundary = type.attributes["boundary"];        
        var boundaryIndex = message.body.indexOf("--" + boundary);
        if(boundaryIndex != null && boundaryIndex >= 0) {
          self.pretext = message.body.substring(0, boundaryIndex);
          self.content = new MimeEntity(message.body.substr(boundaryIndex + boundary.length + 4), type.subType, boundary);
        }
      }
    }
  })(message);
};

module.exports = MultipartDigest;
