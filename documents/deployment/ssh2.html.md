---
layout: article.html.ejs
title: Deployment using SSH
rightsidebar:
---

In order to support deployment from a Windows machine, we had to look for an alternative to `rsync` because Windows lacks that command.  The SSH protocol includes the `sftp` protocol, and it's possible to build a synchronization tool using SSH/SFTP.

This is not well tested but has worked from both Windows and Mac OS X machines.

To use it you enter the following into `config.js`

    deploy_ssh2sync: {
        root_remote: '/path/to/server/directory/for/deployment',
        force: true,
        auth: {
            host: 'host.dom.ain',
            port: 22,
            username: 'login-name-on-server',
            password: 'password-on-server',     // OPTIONAL
            privateKey: require('fs').readFileSync('/local/path/to/.ssh/id_dsa') // OPTIONAL
        }
    }

Either the `password` or `privateKey` fields are required in the configuration.  Obviously the `privateKey` version is safe to check into a repository, because it doesn't expose your private security data.  But the `privateKey` versio can only be used if you have an SSH key available.