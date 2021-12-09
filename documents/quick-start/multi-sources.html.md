---
layout: getting-started.html.njk
title: Using GitHub submodules to collect static website content from multiple Git repositories
rightsidebar:
author: david
publicationDate: December 10, 2021
teaser: |
    In a simple website, a single person or small team can manage the website content using a single Git repository.  But more complex scenarios will require splitting the content across multiple repositories.  For example the marketing team, the support team, and the engineering team, can manage content separately, and through some AkashaCMS wizardry bring them all together into one website build system.
---

The project setup for the AkashaCMS website drove development of this feature.  The website combines documentation for AkashaRender, Mahabhuta, and every plugin, from the corresponding GitHub repositories.

While [discussing AkashaCMS project directory configuration](/quick-start/directories.html) we discussed one method which has been used.  Namely, each of the GitHub repositories just named has a `guide` directory containing documentation for that package.  We then made sure the `guide` directory is included in the npm package.  Therefore, listing each package in `package.json` makes the `guide` directory available at `node_modules/PACKAGE/guide`.  In the Configuration file (`config.js`) we use this declaration:

```js
config.addDocumentsDir({
    src: 'node_modules/@akashacms/plugins-base/guide',
    dest: 'plugins/base'
})
```

This _mounts_ the directory named in `src` at the virtual location named in `dest`.  We simply repeat this for each such npm package.  Again, for more details see [our discussion of directory configuration](/quick-start/directories.html).

With this strategy, one uses `npm install` and `npm update` to download the documentation files, making it easy to distribute and update.  But, this is not the only distribution method which can be used.

The generalized scenario is this:

```js
config
    .addDocumentsDir({
        src: '/path/to/marketing/content',
        dest: 'marketing'
    })
    .addDocumentsDir({
        src: '/path/to/support/content',
        dest: 'support'
    })
    .addDocumentsDir({
        src: '/path/to/documentation/content',
        dest: 'docs'
    })
    .addDocumentsDir({
        src: '/path/to/blog/content',
        dest: 'blog'
    })
```

The directories listed in the `src` fields do not have to come from npm packages.  It's easy to distribute documentation this way, because you simply use `npm update` to get the latest files.  But it's not always desirable, since in many cases nobody else needs those files but your team.  Another issue is the widespread worry about the size of `node_modules` directories, making it preferable to not include documentation in npm packages.

A directory hierarchy like this can be constructed in many ways.  The recommended practice is to use a source code control system to manage your AkashaCMS projects.  That, in turn, makes the following recommendation a good practice.

## Using Git submodules to gather AkashaCMS project content from multiple repositories

The Git submodules feature lets folks use one repository within another repository.  For example, a project might use a library developed by another team.  Their Git repository can reference the library repository as a submodule, making the source code automatically available.

We can do the same with content files used in AkashaCMS projects.

To explore this we'll examine the method used for the AkashaCMS website.  The [GitHub repository for the website](https://github.com/akashacms/akashacms-website) is an excellent example of an AkashaCMS project, and is well worth studying.

Let's start by adding the Mahabhuta repository as a submodule.  The Mahabhuta npm package had previously contained its documentation, but we recently eliminated that reducing the package size considerable.  The side effect was to break the ability to build the AkashaCMS website.

```
$ git submodule add --force \
        git@github.com:akashacms/mahabhuta.git \
        modules/mahabhuta
```

This tells Git to clone the Mahabhuta repository within the `akashacms-website` workspace as `modules/mahabhuta`.  The plan is for each package, we'll clone it in the `modules` directory.  The GitHub URL uses the SSH format, because we might want to push to the repository directly.

I've done this for two packages resulting in this:

```
$ ls -l modules/
total 0
drwxr-xr-x  15 david  admin  480 Dec  7 22:39 akashacms-external-links
drwxr-xr-x  14 david  admin  448 Dec  7 16:44 mahabhuta
```

Take a look inside `modules/mahabhuta` and you'll find the entire repository.

Run this:

```
$ cd modules/mahabhuta/
$ git remote -v
origin  git@github.com:akashacms/mahabhuta.git (fetch)
origin  git@github.com:akashacms/mahabhuta.git (push)
$ cd ../..
$ git remote -v
origin  git@github.com:akashacms/akashacms-website.git (fetch)
origin  git@github.com:akashacms/akashacms-website.git (push)
```

This demonstrates that the submodule directory has a different Git origin URL, and is technically a separate repository, from the main repository.

The file `.gitmodules` contains configuration settings managed by the `git modules` command.  It seems best to use the command to manage this file, rather than to edit it directly.

In the `config.js` file, these document directory settings are used:

```js
config
    ...
    .addDocumentsDir({
        src: 'modules/mahabhuta/guide',
        dest: 'mahabhuta',
        baseMetadata: {
            bookHomeURL: "/mahabhuta/toc.html"
        }
    })
    .addDocumentsDir({
        src: 'modules/akashacms-external-links/guide',
        dest: 'plugins/external-links'
    })
    ...
```

Notice these no longer come from `node_modules`, as had previously been the case, but from `modules`.  Because the directories are mounted in the same location in the virtual directory space, the AkashaCMS build did not change.

There is of course a required task to set up any content links to the files in these mounted directories.  For example, in `partials/site-navbar.html` we have this link to the Mahabhuta documentation:

```html
<a class="dropdown-item" href="/mahabhuta/toc.html">Mahabhuta</a>
```

Because the project configuration mounts every directory into the same virtual space, we can make links to any file from any subproject.

Once you've created this and verified it is working, you can share the Git submodule configuration with others.

```
$ git add .submodules modules
$ git commit -m 'Add submodules configuration' .
$ git push
```

After doing this, you can go to the GitHub repository.  In the repository, you will find something like this in the `modules` directory in the repository:

<img figure src="/quick-start/img/submodules-references.png"/>

This differs any other directory in a Git repository by having the `@ e950c56` reference.  The hex code is a reference to the commit in the source repository matching this submodule.

## Checking out an AkashaCMS project containing submodules

Let's next try checking out the repository, and see how that process works.

As always:

```
$ git clone git@github.com:akashacms/akashacms-website.git
Cloning into 'akashacms-website'...
remote: Enumerating objects: 4408, done.
remote: Counting objects: 100% (30/30), done.
remote: Compressing objects: 100% (26/26), done.
remote: Total 4408 (delta 5), reused 17 (delta 4), pack-reused 4378
Receiving objects: 100% (4408/4408), 11.17 MiB | 2.57 MiB/s, done.
Resolving deltas: 100% (1510/1510), done.
$ cd akashacms-website/
```

But:

```
$ ls modules/mahabhuta/
```

There is a second step required in order to check out the submodules.

```
$ git submodule init
Submodule 'modules/akashacms-external-links' \
    (git@github.com:akashacms/akashacms-external-links.git) \
    registered for path 'modules/akashacms-external-links'
Submodule 'modules/mahabhuta' \
    (git@github.com:akashacms/mahabhuta.git) \
    registered for path 'modules/mahabhuta'
$ git submodule update --recursive
Cloning into '.../akashacms-website/modules/akashacms-external-links'...
Cloning into '.../akashacms-website/modules/mahabhuta'...
Submodule path 'modules/akashacms-external-links': checked out 'e950c56a45a1d39cf26cf988525336adcc75ce6a'
Submodule path 'modules/mahabhuta': checked out 'cbbe7cbe9a23afce51b29dadaf31ac142e63b193'
```

The output is actually very wide, and has been reformatted slightly for your viewing pleasure.  In any case, what we need to do is first initialize the submodule system in the new repository, then use the `update` command using `--recursive` to fetch the repositories.

But, because this is setup with SSH Git URL's there is a potential failure.

```
 > git submodule update --init --recursive modules/mahabhuta # timeout=10
hudson.plugins.git.GitException: \
    Command "git submodule update --init --recursive modules/mahabhuta" returned status code 1:
stdout: 
stderr: Cloning into '/home/docker/jenkinslave/root/workspace/akashacms.com/modules/mahabhuta'...
Host key verification failed.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:akashacms/mahabhuta.git' into submodule \
    path '/home/docker/jenkinslave/root/workspace/akashacms.com/modules/mahabhuta' failed
Failed to clone 'modules/mahabhuta'. Retry scheduled
```

These messages came from inside a Jenkins server.  We configured the Jenkins job to use the Git submodule command, and notice that it checked out the repository with this command:

```
$ git submodule update --init --recursive modules/mahabhuta
```

That gives us additional commands to explore, but first we must examine why this failed.

Namely, the clone of the repository from the SSH URL failed.  Well, the reason would be that the `jenkinslave` user ID this is running under does not have the same SSH key, and its SSH key is not registered with the GitHub repository.  It may not be safe to register the SSH key with the repository.  And more importantly, this repository must be usable by anyone, and therefore cannot be dependent on an SSH key.

What we need to do is go back to the start, by deleting the existing submodule configuration, and setting it up again.  This gives us an excuse to learn how to delete submodule configuration.

## Deleting Git submodule configuration

In the previous section we determined we'd setup the Git submodules using the incorrect Git URL.  Therefore we want to remove the submodules configuration and start over.  Or maybe that was just an excuse to learn how to remove submodules configuration.

```
$ git rm -r modules/
rm 'modules/akashacms-external-links'
rm 'modules/mahabhuta'
$ cat .gitmodules 
```

This is all we need to do to remove the modules.  Notice that it also emptied out the `.gitmodules` file.  You may need to run this command as well:

```
$ rm -rf .git/modules/modules/
```

This directory is inside the `.git` area, and contains house-keeping files for the submodules.

```
$ git status -s
M  .gitmodules
D  modules/akashacms-external-links
D  modules/mahabhuta
```

Next we see the commits that must be made because of changes that were made.

```
$ git commit -a -m 'Remove submodule configuration'
[watcher 742197c] Remove submodule configuration
 3 files changed, 8 deletions(-)
 delete mode 160000 modules/akashacms-external-links
 delete mode 160000 modules/mahabhuta
$ git push
...
```

And, we can commit these changes to the repository.

## Reinitializing Git submodules the better way

Let's now repeat the steps from before, but this time using the `https://github.com` URL for the repositories.

```
$ git submodule init
$ git submodule add --force \
    https://github.com/akashacms/mahabhuta.git \
    modules/mahabhuta
...
$ git submodule add --force \
    https://github.com/akashacms/akashacms-external-links.git \
    modules/akashacms-external-links
...
```

With these repository URLs anybody should be able to make a clone our repository.

We've seen two different Git URLs being used.  The SSH URL is more useful when you want the ability to push commits from the submodule directory to its repository.  The HTTPS URL is useful when the person cloning the repository should not have that ability.

Now that we've setup the submodule configuration again, let's commit these changes to the repository:

```
$ git status -s
M  .gitmodules
A  modules/akashacms-external-links
A  modules/mahabhuta
$ git commit -a -m 'Add submodule configuration again'[watcher 7abe82b] Add submodule configuration again
 3 files changed, 8 insertions(+)
 create mode 160000 modules/akashacms-external-links
 create mode 160000 modules/mahabhuta
$ git push
...
```

We can then test, again, cloning the repository and running the commands shown earlier to pull down the submodules.  This should correctly, and in the `.gitmodules` file you should see the HTTPS URLs for the submodules.  Additionally, make sure to try these commands from a user ID whose SSH key is not registered with the GitHub repository.

## How do push changes to a GitHub-hosted Git submodule repository

Now that we have this submodule setup, there's a likely thing we want to do.  Namely, we likely want to directly edit files in the submodule, then push those files to the repository corresponding to the submodule.

In one of your submodules directories, try this:

```
$ touch foo.js
$ git add foo.js
$ git status -s
A  foo.js
$ git commit -m 'foo' foo.js 
[master 4389efb] foo
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 foo.js
$ git push
```

We're just creating a dummy file and attempting to push it to the repository.

But, because we're using an HTTPS URL, we learn that on August 13, 2021, GitHub removed support for password authentication on HTTPS URLs.  The [blog post for that announcement](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/) says we are supposed to use a _Personal Access Token_ instead.  The [documentation to do this is straightforward](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

As soon as we generate the personal access token, this works.  The documentation says the token can be used in place of the password that is requested when using the HTTPS URL.  We're also instructed to give the token a time limit, and limited access rights.

