# mehl.js Readme

mehl.js is a mail parsing library with support for several standard MIME types.
It automatically decode multipart messages, images, ..

## Usage

To parse an e-mail, simply do the following:

```javascript
var mehljs = require("mehljs");
var fs = require("fs");

var mailText = fs.readFileSync("/path/to/mail.eml");
var mail = new mehljs.Mail(mailText);
```

## What's still missing?

 * Support for additional MIME types and better support for already included
   types, especially multipart/digest, S/MIME and PGP. Decryption of messages
   and message parts should be available.
 * Support for simple jquery-like search-patterns to find message parts. E.g.
   something like
   `mail.$("multipart/* .Content-Disposition[filename='asdf.pdf']")` to select
   all MIME parts with the filename "asdf.pdf".

## What about the name?

The name mailjs was already taken. The word "Mehl" is german for flour, but is
pronounced simillary (not exaclty the same) to mail.