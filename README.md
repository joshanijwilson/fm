FleetManager

Consists of several sub-projects:

/client
  A web aplication - client. This is what end users interact with.
  - AngularJS
  - Twitter Bootstrap

/server
  An Express application (Node.js) that provides the API for clients and serves the web client.
  - Node.js
  - Express
  - MySQL

/pdf_generator
  A Java application/tool that fill in PDF forms. It is called by the webserver to generate PDF protocols.
  - Apache PDFbox library

/scripts
  Shared scripts.
