---
layout: blog.html.njk
title: Announcing Bootstrap v5 support for AkashaCMS projects
publicationDate: August 2, 2026
blogtag: news
teaser: |
  Bootstrap 5 has been out for a long time.  Inertial forces related to what seemed a huge task to convert sites from 4.6.x to 5.x prevented adding Bootstrap 5 to the Bootstrap theme plugin.  That's now been fixed.
heroPicture:
---

The [`@akashacms/theme-bootstrap`](https://www.npmjs.com/package/@akashacms/theme-bootstrap) plugin integrates support for the Bootstrap framework with AkashaCMS projects.

While Bootstrap is regularly used for interactive web applications, it is useful for simple page layout and the doo-dah's one use to spiff up a regular website.  Bootstrap v4.x has been available via this plugin for many years.

As of now there is a dual release train for this plugin:

* `@akashacms/theme-bootstrap@4.6.x` -- supports Bootstrap 4.6.x
* `@akashacms/theme-bootstrap@5.x` -- supports Bootstrap 5.x

Both are compatible with either AkashaRender 0.9.x or 0.10.x.

In `package.json`, the `@akashacms/theme-bootstrap@4.6.x` release is available this way:

```json
{
    "dependencies": {
        "@akashacms/theme-bootstrap": "^4.6.x"
    }
}
```

For the 5.x release train, do this instead:

```json
{
    "dependencies": {
        "@akashacms/theme-bootstrap": "akashacms/akashacms-theme-bootstrap#5.x",
    }
}
```

That is, the 4.6.x releases are published to npm, while the 5.x releases are still on GitHub only.

## Changes for the 5.x branch

The primary purpose of the theme-bootstrap plugin is overriding the partials from other packages with ones which use Bootstrap goodies to look better.  There are also a few custom tags which simplify using some of the Bootstrap goodies.

All of those partials have been rewritten for Bootstrap 5.x compatibility.

In your Configuration file:

```js
import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';

config
    .use(ThemeBootstrapPlugin)
    // ...
```

In the past, it was required to declare dependencies in `package.json` for the Bootstrap, Popper.js, and (for 4.6.x) jQuery.  Then your configuration file used `addAssetDir` to mount asset directories for each of those packages.

That's no longer necessary.  You simply declare the package as a dependency, and use the plugin in the Configuraton.  The plugin now declares the correct version of Bootstrap and Popper, and takes care of mounting the assets directories.

In case you need to refer to these asset directories:

* Bootstrap: `/vendor/bootstrap`
* @popperjs/core: `/vendor/popper.js`

The plugin also auto-imports the CSS and JS for these two packages into every page.

The Bootstrap project dropped jQuery from the 5.x requirements.  Therefore, jQuery is no longer referenced.

## Converting partials for Bootstrap 5.x

The partial templates provided by this package have already been converted.

However, your project may have written some custom partial templates.  Those have not been converted.

The Bootstrap project provides this migration guide: https://getbootstrap.com/docs/5.3/migration/

This older version of that document may also be useful: https://getbootstrap.com/docs/5.0/migration/

## Further theming of Bootstrap

The default Bootstrap theme is nice, but don't you want some customized colors?

The customization documentation is useful:  https://getbootstrap.com/docs/5.3/customize/overview/

The Bootstrap project provides a few free themes, along with an extensive customizer service:  https://bootstrap.build/themes/

The `akashacms.com` website uses the Pulse theme with no additional customization.  The file `bootstrap.min.css` was downloaded from the Pulse theme, then renamed to `pulse.min.css`.

In the configuration, this was enabled as so:

```js
config
    .addStylesheet({ href: "/pulse.min.css" })
    .addStylesheet({ href: "/style.css" })
```

The additional `style.css` file is used for additional customization.

