/**
  Mail utility module.
  
  @module utils
*/

"use strict";

var buffer = require("buffer");
var encodingUtils = require("encoding");

var quotedPrintableRegex = /=[0-9a-fA-F][0-9a-fA-F]/g;

/**
  This class is is just a container for some class methods. It seems yuidocjs
  doesn't support documentation of functions that are outside of classes.
  
  @class Utils
*/
var Utils = function() {
};

/**
  Decode all quoted-printable characters in the text.

  @method decodeQuotedPrintable
  @static
  @param text {String} The string containing quoted-printable character
    sequences.
  @return {String} Returns the decoded text. If the input text is null or
    undefined, null is returned.
*/
Utils.decodeQuotedPrintable = function(text) {
  if(text == null) {
    return null;
  }
  return text.replace(quotedPrintableRegex, function(part) {
    var code = parseInt(part.substring(1), 16);
    return String.fromCharCode(code);
  });
};

/**
  Convert an input text from a given input encoding.
  
  @method convert
  @static
  @param text {string} The text to be converted.
  @param encoding {string} The encoding (either an encoding supported
    directly by the nodejs buffer module or the 8bit or quoted-printable
    encoding).
  @return Returns either a Buffer (for encodings natively supported by the
    buffer module) or a string for other encodings. You need to test for the
    result type yourself and convert the result to what you need.
*/
Utils.convert = function(text, encoding) {
  encoding = encoding.toLowerCase();
  if(buffer.Buffer.isEncoding(encoding)) {
    return new buffer.Buffer(text, encoding);
  } else {
    if(encoding === "quoted-printable") {
      return Utils.decodeQuotedPrintable(text);
    }
    // a transfer encoding of 7bit or 8bit has no effect on the input
    // text. in this case, no transformations are applied and the actual
    // encoding is determined by the content type.
    return text;
  }
};

var mimeWordRegex = /=\?([^?]*)\?([^?]*)\?([^?]*)\?=/g;

/**
  Decodes the given text using the charset and encoding.

  @method decodeMimeWord
  @static
  @param charset {String} The name of the (input) charset.
  @param encoding {String} A single character specifying the encoding
    of the text. This can be either "Q" for quoted printable or "B" for
    base64.
  @param text {String} The encoded text.
  @return Returns the decoded text as a string. If text is null or undefined,
    the function returns null. Otherwise, a string is returned.
*/
Utils.decodeMimeWord = function(charset, encoding, text) {
  if(text == null) {
    return null;
  }
  charset = charset.toLowerCase();
  encoding = encoding.toLowerCase();
  text = Utils.convert(text, (encoding === "b" ? "base64" : "quoted-printable"));
  text = typeof(text) === "string" ? text : text.toString("binary");
  return encodingUtils.convert(text, "utf8", charset);
};

/**
  Decodes the header value of an e-mail or MIME part header by decoding the
  =?charset?encoding?text?= parts. The result is a utf8 string.
 
  @method decodeMimeHeaderValue
  @static
  @param text {String} The text (aka the value of the header field) to be
    decoded.
  @return {String} Returns a utf8 string with all MIME words being decoded.
*/
Utils.decodeMimeHeaderValue = function(text) {
  var match;
  var result = "";
  var start = 0;
  while((match = mimeWordRegex.exec(text)) != null) {
    result += text.substring(start, match.index);
    var charset = match[1], encoding = match[2], encodedText = match[3];
    result += Utils.decodeMimeWord(charset, encoding, encodedText);
    start += encodedText.length;
  }
  if(start < text.length) {
    result += text.substring(start);
  }
  return result;
};

module.exports = Utils;
