/**
  Module for handling the multipart/alternative MIME type. See
  {{#crossLink "MultipartDigest"}}{{/crossLink}} for available methods
  and properties.
  
  @module multipart_alternative
*/

var MimeEntity = require("../../mime_entity");

var MultipartAlternative = function(message) {
  var self = this;

  this.multipart = true;
  this.multipartType = "alternative";
  this.pretext = "";
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

module.exports = MultipartAlternative;
