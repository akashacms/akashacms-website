---
layout: blog.html.njk
title: Trimming the size of PlantUML support in AkashaCMS 0.10
publicationDate: July 5, 2026
blogtag: news
teaser: |
    Yesterdays improvements to Mermaid support inspired work on PlantUML support.  We have elminated the PlantUML JAR from the NPM package, and added the flexibility to use PlantUML with either a downloaded JAR file or a PlantUML server.
heroPicture:
---

PlantUML is a comprehensive platform for creating diagrams from textual descriptions.  The goal for the `@akashacms/diagram-makers` package is simplifying adding diagrams to our AkashaCMS projects.  It currently supports three diagram rendering platforms: PlantUML, Mermaid, and Pintora.

Because PlantUML is implemented in Java, it does not natively run on Node.js, and it's difficult to integrate cleanly with a Node.js application.

In the past the `@akashacms/diagram-makers` package shipped a copy of the PlantUML JAR file with the package, then behind the scenes it invoked a Java VM for each diagram.  While this worked, it meant for a heavy CPU time cost (launching Java is not fast) as well as the disk space cost of that JAR file.

In the 0.10 branch, we now have the ability to use either a PlantUML JAR file, or a PlantUML server.  The latter is actually faster, is easy to deploy using Docker, and even gives you a free diagram editor.

## Using a downloaded PlantUML JAR file

We start by downloading a JAR file from the PlantUML GitHub repository.  While you can go to the repository yourself, we've made it this simple:

```shell
$ npx diagram-makers plantuml-download --help
Usage: diagram-makers plantuml-download [options]

Download the PlantUML JAR file for use with the PLANTUML_JAR environment variable

Options:
  --plantuml-version <version>  PlantUML version, such as 1.2025.0.  Default: the latest release.
  --edition <edition>           JAR edition: gpl, mit, lgpl, asl, epl, bsd (default: "mit")
  --output-dir <outDir>         Directory into which the JAR is downloaded (default: ".")
  -h, --help                    display help for command

$ npx diagram-makers plantuml-download --plantuml-version 1.2025.0 --edition mit
Downloading https://github.com/plantuml/plantuml/releases/download/v1.2025.0/plantuml-mit-1.2025.0.jar
Downloaded plantuml-mit-1.2025.0.jar

To use this JAR for PlantUML rendering, set the environment variable:

    export PLANTUML_JAR=/home/david/Projects/akasharender/akashacms-example/plantuml-mit-1.2025.0.jar

Rendering with the JAR requires Java to be installed and in your PATH.
```

The `plantuml-download` subcommand makes it simple to download the JAR file.  The `--edition` flag selects the license for the JAR file.

Then, as the output says, you set the environment variable PLANTUML_JAR to the pathname of the JAR file.

In this mode, the `@akashacms/diagram-makers` plugin executes `java -jar ...` for each PlantUML document to be rendered.  As we'll see, there is a performance hit for this.

## Using a PlantUML server

The PlantUML server also ships a PlantUML server that is easily deployable by Docker.

This server supports both rendering PlantUML documents to either PNG or SVG, but it also includes a PlantUML editor/previewer.

The easiest way to run the PlantUML server is, so long as you have Docker installed on your computer, with this command:

```shell
$ docker run -d --name plantuml -p 8080:8080 plantuml/plantuml-server:jetty
```

This starts up the server on `http://localhost:8080`.  

You then set this environment variable:

```shell
$ export PLANTUML_SERVER_URL=http://localhost:8080
```

If you need to use a different port, assign a different port number like `-p 2080:8080` to use `http://localhost:2080`.  Then use the same port number for `PLANTUML_SERVER_URL`.

In this mode, the `@akashacms/diagram-makers` plugin uses an HTTP API supported by this server.

### Accessing the PlantUML editor

In your browser paste in the `PLANTUML_SERVER_URL` value, such as `http://localhost:2080/`.

Make sure to use `http://` and not `https://`.

The editor has two panes:

1. A text editor area where you enter the document text
2. A preview editor showing the matching document

There are buttoms to _Import diagram_ or _Export diagram_, but the user interface isn't all that good.  You're better off using copy/paste to/from a programmers editor like Codium.

## Execution time - Java VM versus PlantUML server

There is a significant performance boost from using the PlantUML server.

In the Java VM mode, a new Java instance is launched for every diagram.  While Java is an excellent language, with great performance, it's startup time is not terribly fast.

Using the PlantUML example in the `akashacms-example` repository as an informal performance test we see:

1. Java VM mode: The time-to-render for the page is anywhere up to 25 seconds
2. Java Server mode: The time-to-render for the page is about 5 seconds

## Bottom line

Between yesterdays work on [Mermaid rendering time](/news/2026/mermaid-wasm-renderer.html) and todays work on PlantUML, we have

1. Reduced the deployment size of the `@akashacms/diagram-makers` plugin
2. Reduced execution time for rendering both PlantUML and Mermaid diagrams

For PlantUML we now can easily choose between JAR or Server mode.  And, it's clear that PlantUML server mode gives us a big performance boost.

