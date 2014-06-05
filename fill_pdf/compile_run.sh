#!/bin/bash


DEPS="pdfbox-app-1.8.4.jar:quick-json-1.0.2.3.jar"

javac -classpath $DEPS FillPDF.java
java -classpath $DEPS:. FillPDF "$@"
