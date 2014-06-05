#!/bin/bash

DEPS="pdfbox-app-1.8.4.jar:gson-2.2.4.jar"


javac -classpath $DEPS FillPDF.java
java -classpath $DEPS:. FillPDF "$@"
