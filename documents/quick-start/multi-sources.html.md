---
layout: getting-started.html.njk
title: Using GitHub submodules to collect static website content from multiple Git repositories
rightsidebar:
author: david
publicationDate: December 10, 2021
teaser: |
    In a simple website, a single person or small team can manage the website content using a single Git repository.  But more complex scenarios will require splitting the content across multiple repositories.  For example the marketing team, the support team, and the engineering team, can manage content separately, and through some AkashaCMS wizardry bring them all together into one website build system.
---

What's needed is a method to have one directory hierarchy formed from two or more source repositories.  Following from the example, the marketing, support and engineering teams would have separate Git repositories.  Each contains content from the corresponding teams, and are meant to be joined together as an AkashaCMS project for producing a combined website.

In an AkashaCMS configuration (as discussed in [](/quick-start/directories.html)), it might look like this:

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

These configuration settings describe four sections to the website, `marketing`, `support`, `docs` and `blog`.  For each, the content files come from a different filesystem location.

What we're discussing in this page is accessing these content files while storing them in separated repositories.  Using separate repositories allows each section to be managed on their own schedule.

The [`akashacms.com` website](https://github.com/akashacms/akashacms-website) implements one method for this model.  Namely, each of the GitHub repositories just named has a `guide` directory containing documentation for that package.  We then made sure the `guide` directory is included in the npm package.  Therefore, listing each package in `package.json` makes the `guide` directory available at `node_modules/PACKAGE/guide`.  In the Configuration file (`config.js`) we use this declaration:

```js
config.addDocumentsDir({
    src: 'node_modules/@akashacms/plugins-base/guide',
    dest: 'plugins/base'
})
```

This _mounts_ the directory named in `src` at the virtual location named in `dest`.  We simply repeat this for each such npm package.  Again, for more details see [our discussion of directory configuration](/quick-start/directories.html).

Not all content is suitable for distributing as a dependency in `package.json` as npm packages.  For each source of content, that's stored in a separate repository, what is the correct way to get that content into the AkashaCMS project for the website?

## Distributing content as dependencies in `package.json`

The `dependencies` section of `package.json` is designed for installing Node.js packages in a Node.js application.  But, the npm repository is today used for distributing other packages, such as front-end browser-side libraries.  And, even for Node.js packages, some package authors decide to distribute documentation in the package, as has been done with AkashaCMS packages.

For the AkashaCMS website, the dependencies are in this form:

```json
"dependencies": {
    ...
    "@akashacms/plugins-base": "akashacms/akashacms-base",
    "@akashacms/plugins-blog-podcast": "akashacms/akashacms-blog-podcast",
    "@akashacms/plugins-booknav": "akashacms/akashacms-booknav",
    ...
}
```

These package references are direct to the Git repository, rather than the published package in the npm repository.

For the case mentioned earlier, sections for Marketing, Support, Documentations, and Announcements, it makes no sense to distribute that content through the npm repository.  For an npm package it might make sense to distribute package documentation that way, because it's easier to coordinate documentation changes with code changes.  But, consider the uproar over the size of `node_modules` and the necessity of reducing package size.  Eliminating documentation, and tests, from npm packages would reduce package size.

Why should the npm servers be burdened with carrying more bytes than are necessary for the users of the package?  Is it appropriate to distribute documentation or test suites in npm packages?  The bytes consumed by distributing documentation and test suites in npm packages increases the bloat.

To eliminate files from an npm package requires a `.npmignore` file.

The [npm documentation describes in more depth how to specify dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies).  For example, we can even more directly specify a Git URL, such as these examples:

```json
"dependencies": {
    ...
    "marketing": "git+ssh://USER@SERVER/path/to/marketing.git",
    "support": "git+ssh://USER@SERVER/path/to/support.git",
    "documentation": "git+ssh://USER@SERVER/path/to/documentation.git",
    "news": "git+ssh://USER@SERVER/path/to/news.git",
    ...
}
```

The `dependencies` can directly reference any HTTPS URL, or any Git repository.  For Git URLs, we can reference specific commits or branches.

Therefore, one possible mechanism for gathering content for an AkashaCMS project, where the content for subsections is split across Git repositories.  Direct Git URLs in `package.json` dependencies bypasses the npm repository, while using the flexibility they provide.

As interesting as that is, there is another method, Git submodules, to understand.

## Using Git submodules to gather AkashaCMS project content from multiple repositories

The Git submodules feature lets folks use one repository within another repository.  For example, a project might use a library developed by another team.  Their Git repository can reference the library repository as a submodule, making the source code automatically available.

Git submodules is a large feature which we'll only touch on here.  [An excellent introduction about Git submodules on Techsparx](https://techsparx.com/software-development/git/submodules.html) explains this feature in more depth.

What we'll do here is explore using Git submodules in an AkashaCMS project, using the [GitHub repository for the `akashacms.com` website](https://github.com/akashacms/akashacms-website) to explain what to do.

Briefly, a Git submodule is:

* A parent Git repository contains submodule configuration referencing one or more other Git repositories
* The external repositories appear within the directory tree of the checked-out parent repository
* The parent repository contains a reference to the external repository, as well as the SHA-1 hash for the commit which is to be checked out

Let's start by adding the Mahabhuta repository as a submodule.  To do so, we ran this command

```
$ git submodule add --force \
        https://github.com/akashacms/mahabhuta \
        modules/mahabhuta
```

This tells Git to clone the Mahabhuta repository within the `akashacms-website` workspace as `modules/mahabhuta`.  A couple house-keeping files Git uses are setup as well, but we can do everything using normal `git` and `git submodule` commands.

We used the HTTPS URL for the Mahabhuta repository because this repository must be usable by anybody with no preconfiguration required.  In other circumstances it is better to use an SSH URL instead, because SSH URLs make it easier to push commits to submodule repositories.  But for the `akashacms-website` repository, a hard requirement is allowing anyone to clone the repository.

At the time of this writing, this command has been executed for two AkashaCMS packages, resulting in this:

```
$ ls -l modules/
total 0
drwxr-xr-x  15 david  admin  480 Dec  7 22:39 akashacms-external-links
drwxr-xr-x  14 david  admin  448 Dec  7 16:44 mahabhuta
```

Take a look inside each and you'll find the entire repository is checked out.

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

The files `.gitmodules` and `.git/config` contain configuration settings managed by the `git submodules` command.  It seems best to use the command to manage these files, rather than to edit them directly.

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
$ git status -s
A .submodules
A modules
$ git add .submodules modules
$ git commit -a -m 'Add submodules configuration'
$ git push
```

After doing this, you can go to the GitHub repository.  In the repository, you will find something like this in the `modules` directory in the repository:

<img figure src="/quick-start/img/submodules-references.png"/>

This differs any other directory in a Git repository by having the `@ e950c56` reference.  The hex code is a reference to the SHA-1 commit in the source repository matching this submodule.

## Checking out an AkashaCMS project containing submodules

Let's next try checking out the repository, and see how that process works.

As always:

```
$ git clone https://github.com/akashacms/akashacms-website
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

If you thought this was going to be trivially easy, think again.  What's happened is that we cloned the repository, but Git doesn't automatically check out the contents of submodules.  Instead we dive a little deeper.

One alternative method is to instead use this command when cloning the repository:

```
git clone  --recurse-submodules \
        https://github.com/akashacms/akashacms-website
```

Adding this option ensures the submodules are checked out when the parent repository is checked out.

Another option is, after cloning the repository without using the `--recurse-submodules` option, to change directory into the repository and run this command:

```
$ cd akashacms-website
$ git submodule update --init --recursive
Submodule 'modules/akashacms-external-links' \
    (https://github.com/akashacms/akashacms-external-links.git) \
    registered for path 'modules/akashacms-external-links'
Submodule 'modules/mahabhuta' \
    (https://github.com/akashacms/mahabhuta.git) \
    registered for path 'modules/mahabhuta'
Cloning into \
    '/Volumes/Extra/akasharender/t/akashacms-website/modules/akashacms-external-links'...
Cloning into \
    '/Volumes/Extra/akasharender/t/akashacms-website/modules/mahabhuta'...
Submodule path 'modules/akashacms-external-links': \
    checked out 'e950c56a45a1d39cf26cf988525336adcc75ce6a'
Submodule path 'modules/mahabhuta': \
    checked out '0aa32ee05a137c7f0cccfc89cea8bb517a23a290'
```

The output is actually very wide, and has been reformatted slightly for your viewing pleasure.  The `submodule update` command is how we update the submodule configuration.  The `--init` option makes sure to initialize submodule support.  The `--recursive` option makes sure to handle complex cases like a submodule repository itself containing submodules.

The bottom line is the two lines reading _checked out 'SHA-1 hash'_.  This means the corresponding repositories were checked out at the commit named by the hash code.

Since it is the best practice to automate tasks like this, in the `akashacms-website` repository we've added the following script in `package.json`:

```json
"scripts": {
    "update:modules": "git submodule update --recursive --remote"
}
```

Hence, we've recorded this command and can do the update at any time by running `npm run update:modules`.

## How to push changes to a GitHub-hosted Git submodule repository

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
fatal: You are not currently on a branch.
To push the history leading to the current (detached HEAD)
state now, use

    git push origin HEAD:<name-of-remote-branch>


```

The last fails with a somewhat inscrutable message.  This message is telling you that the submodule repository is in a _detached HEAD_ state.

The solution for this is, in each submodule, to execute this command:

```
$ cd path/to/submodule
$ git checkout BRANCH-NAME
```

Once you do this, the above commands will work, and you'll be able to use `git push`.  Except...

This will be easy if you're using an SSH URL in the submodule, and your SSH key is registered with the Git repository.  But, if you're using an HTTPS URL, authenticating with the Git repository is trickier.

In the olden days of GitHub, we would be prompted for a user-name and password, and then be good to go.  But, security needs have dictated change.  Today if we try this, we learn that on August 13, 2021, GitHub removed support for password authentication on HTTPS URLs.  The [blog post for that announcement](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/) says we are supposed to use a _Personal Access Token_ instead.  The [documentation to do this is straightforward](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Fortunately getting that token is easy, and well documented.  As soon as we generate the personal access token, this works.  The documentation says the token can be used in place of the password that is requested when using the HTTPS URL.  We're also instructed to give the token a time limit, and limited access rights.

## How to update if submodule repository has changed

Another use case is when the source repository for a submodule has been updated.

Someone else may have changed files in a submodule repository.  You therefore need to update the submodules, so that you're up-to-date with others on the team.

Earlier we looked at this command:

```
$ git submodule update --recursive
```

But, this doesn't do the desired thing.  The files are not merged into the workspace.  What's needed is to add the following option:

```
$ git submodule update --recursive --remote
```

This does the right thing, namely merging the upstream commits into the submodule.

One effect of this is updating the submodule to use the new SHA-1 commit hash.  In the parent module directory, run this:

```
$ git status -s
M submodule-path
```

For each submodule that has received changes, you'll see the `M` status.  This status means a commit, recording the new SHA-1 hash, is ready to be pushed to the repository.

```
$ git commit -m 'Update submodule' submodule-path
$ git push
```

This commits the updated submodule reference.
