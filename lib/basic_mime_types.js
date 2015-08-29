/**
  Provides utility methods for basic mime type registration.

  @module basic_mime_types
*/

"use strict";

var fs = require("fs");
var pathUtil = require("path");

/**
  Just a container class, since yuidocjs doesn't seem to provide support
  for functions (only methods).
  
  @class BasicMimeTypes
*/
var BasicMimeTypes = function() {
};

/**
  Registers all the basic mime type handlers provided in the mehljs
  package (<package-folder>/lib/mime_types/<type>/<subtype>.js).
  
  @method register
  @param [registry] {MimeTypeRegistry} The registry used to register the
    loaded type handlers. If no registry (or null) is provided, the global
    object mehljs.mimeTypeHandlers is used. If the global object doesn't exist,
    the handlers are not registered.
*/
BasicMimeTypes.register = function(registry) {
  registry = registry == null ? mehljs.mimeTypeHandlers : registry;
  
  if(registry != null) {
    var typeFoldersPath = pathUtil.join(pathUtil.dirname(module.filename), "mime_types");
    var typeFolders = fs.readdirSync(typeFoldersPath);
    for(var i = 0; i < typeFolders.length; i++) {
      var type = typeFolders[i];
      var typeFolder = pathUtil.join(typeFoldersPath, type);
      if(fs.lstatSync(typeFolder).isDirectory()) {
        var typeModuleFiles = fs.readdirSync(typeFolder);
        for(var j = 0; j < typeModuleFiles.length; j++) {
          var filename = typeModuleFiles[j];
          var typeModuleFile = pathUtil.join(typeFolder, filename);
          if(filename.match(/\.js$/) != null && fs.lstatSync(typeModuleFile).isFile()) {
            var subtype = filename.replace("__plus__", "+").replace(/\.js$/, "");
            registry.setHandler(type, subtype, (function(filename) {
              var wrapper = function() {
                var Handler = require(filename);
                return Handler;
              }
              return wrapper;
            })(typeModuleFile));
          }
        }
      }
    }
  }
};

module.exports = BasicMimeTypes;
