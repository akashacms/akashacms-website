---
layout: blog.html.njk
title: Building knowledge bases and websites with LLM-Wiki
publicationDate: May 1, 2026
blogtag: news
teaser: Karpathy's idea, the LLM-Wiki, is an excellent tool for collecting and analyzing a knowledge base of information.  With AkashaCMS one can easily build websites drawing on a LLM-Wiki-managed knowledge base.
heroPicture:
---
I have always wanted something like the LLM-Wiki to organize the information I like to collect (er.. hoard).  As an information-addicted person, I tried many ways to store and organize information.  So, when I heard about the LLM-Wiki idea, I watched many videos and worked out a way of building an LLM-wiki.

The LLM-Wiki process is, in my mind, an ideal companion to publishing a website using a static HTML generation tool like AkashaCMS.

One core of the LLM-Wiki concept is storing content as Markdown files because of the ubiquity of Markdown tools.  Most or all static website tools, like AkashaCMS, convert Markdown files to HTML projects.

Therefore, this vision immediately leaps to mind:

- In the same project directory you have both an LLM-Wiki and content documents that produce a website or other HTML projects
- You use the LLM Wiki to research background material for use in the website
- This entails configuring the project directory to support the use of Claude Code, Open Code, or similar AI agent tools
- The project directory also contains the website content directories and static HTML generator configuration
	- Your AI agent can be used to assist developing the website content

Put more simply - an LLM-Wiki for content research alongside website content documents.

Obsidian, as a very nice Markdown editor, and as a powerful tool for organizing and browsing information, is the icing on the cake for such a project.

## Overview of the LLM-Wiki idea

Alexei Karpathy is a leading thought-leader in artificial intelligence systems development, having worked at the leading companies like OpenAI.

In March 2026 he posted to Twitter an outline of an idea about reducing token usage in AI systems for the common task of chatting with the AI about information in a group of documents.  Traditionally we plop the documents into a directory, then require the AI to frequently rebuild a context window from scratch when we ask questions related to those documents.

His idea, called **LLM-Wiki** is to use an AI to predigest those documents in a way that helps the AI more quickly walk through the information while consuming fewer tokens.  A side benefit is creating a knowledge base where the content is Markdown files that can be used by any tool in the large Markdown ecosystem, and which makes it easy to grow and ingest new information into the knowledge base.

The tools required are simple:

- Using Obsidian as the "IDE".  It is an excellent Markdown editor with a large ecosystem of knowledge management tools available.
- Using Claude Code to manage the LLM-Wiki files.  This could be any AI coding agent (I prefer and use Open Code instead).
- Use a workflow, like the Obsidian Web Clipper, to bring in raw content files into the project directory
- Using an LLM AI system (either local or cloud) to process the raw content files, to generate summaries of the raw content, and to extract concepts from the raw content.
- A `CLAUDE.md` or `AGENTS.md` file describing the rules for managing the LLM-Wiki

Everything is contained in a project directory.

To read his full concept writeup: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
## Practical use-case: The MODBUS Wiki

In my day job, I write software for managing energy consumption in facilities like electric vehicle charging station locations.

One of the things I must know about is the MODBUS protocol, a communications protocol from the dark ages of the 1970s.  Yes, there were computers before the Internet.

To learn how to use LLM-Wiki, I've built the MODBUS Wiki (https://github.com/clean-energy-tools/modbus-wiki) which is derived from the official MODBUS specifications.  The goal is to help people learn MODBUS with beginner-friendly descriptions where all information is derived from the official specifications.

To do this, I converted the PDFs of the specification documents into Markdown, and wrote an `AGENTS.md` describing how the LLM-Wiki works.  I then "ingested" the Markdown files, which resulted in a bunch of concept documents and summaries of the specifications.  After I told the LLM-Wiki to start saving answers as answer documents, the wiki was able to grow further.

The MODBUS wiki is designed to be used in these modes:

1. Browsing the wiki content in the GitHub repository
2. Browsing the wiki content on a website
3. Cloning the GitHub repository, and using an AI coding agent to chat with the wiki
4. Offering new content to the MODBUS wiki project through GitHub pull requests
## Tools required for building an LLM-Wiki

We've already named the three main tools for building an LLM-Wiki

1. *Markdown editor preferably with knowledge management features*:  [Obsidian](https://obsidian.md) is an excellent tool for this purpose.  
2. *AI coding agent that easily edits files on the local file-system*: There are many agents, like Claude Code or Open Code, which run in a terminal window, where you can chat with an AI coding agent, and where the AI coding agent can edit the files in a directory.  These are meant for use in software development projects, but are also easy to use in editing text in Markdown documents.
3. *Instructions (`CLAUDE.md` or `AGENTS.md`) to the AI system on how to build the LLM-Wiki*: This is a Markdown document where you describe the procedures of building an LLM-Wiki.

## Designing a LLM-Wiki using `CLAUDE.md` or `AGENTS.md`


### LLM-Wiki directory structure

## Managing multiple topic-focused LLM-Wiki's




## Document ingestion in LLM-Wiki's


### Recommended workflow for bringing new content into an LLM-Wiki


## Expanding your LLM-Wiki: generating and refining content by getting answers to questions


## Adding an AkashaCMS website to an LLM-Wiki project directory

Tools required for setting up an AkashaCMS website

Quick walkthrough of AkaashaCMS project setup

## Creating website content using the LLM-Wiki content

Converting LLM-Wiki research into blog posts

Adding a non-Wiki non-Website directory where you write your notes from your thinking

Separation between your content and AI content

## Conclusion


