---
layout: getting-started.html.njk
title: Importing CSV, TSV, and YAML, tables into AkashaCMS documents
rightsidebar:
author: david
publicationDate: August 10, 2026
step: 15
---

Sometimes we have data in a CSV (or similar format) file that must be displayed in an AkashaCMS document.

Built-in to AkashaRender is a custom element, `<csv-table>`, for this purpose.  It accepts an input file in one of these formats, formatting it as an HTML table:

* CSV or TSV files
  * The delimiter is customizable
  * It reads field names from the header row, if present
* YAML-based arrays of records

This custom element is supplied by the built-in plugin, meaning it is always available.

The element looks like this:

```html
<csv-table
    file-name="data/people.csv"
    template="people-row.html.njk"
    before-template="people-before.html.njk"
    after-template="people-after.html.njk"
    format="csv"
    delimiter=","
    header="true"></csv-table>
```

The file name is resolved in this order:

* A file in the assets directory
* A file in the documents directory
* A file in the filesystem

The first two are matched against vpaths in either the assets or documents directory hierarchy.

If these fail, then a search is made in the rest of the filesystem.  An absolute filename is used as-is.  Otherwise, a relative filename is resolved relative to `config.configDir`, which is the directory containing the configuration file.

## Three templates

The primary use case is creating an HTML table from the data file.  The three templates mentioned here serve that purpose:

* The _before template_ is essentially the `<table>` element, plus the first `<tr>` which uses `<th>` elements to create the table headers.
* The _template_ is used per-row to display the row data
* The _after template_ is essentially the `</table>` element

## Row data

The interpretation of a table into rows and columns is intentionally flexible, since these kinds of data files come in many forms.

The CSV/TSV first row may be interpreted as a header row, containing the field name for each column.  Field names may also be interpreted from YAML data.

The per-row template receives this data:

* One variable per named column if field names are available
* The `fields` array contains one entry per column in the row
* The `columns` array matches the field names, if they were avilable, and is an array matching the `fields` array order
* The `index` is a 0-based row number
* The `rowNumber` is a 1-based row number

The per-row template could therefore use the named columns:

```html
<tr><td>{{ name }}</td><td>{{ city }}</td></tr>
```

Or, positionally it can emit every field:

```html
<tr>{% for f in fields %}<td>{{ f }}</td>{% endfor %}</tr>
```

And, if you want to number the rows:

```html
<tr>
<td>{{ rowNumber }}</td>
{% for f in fields %}<td>{{ f }}</td>{% endfor %}
</tr>
```

## Making a complete table

The previous section showed how to make the table body.  To make it a table requires the surrounding `<table>` structure.

There are default templates for `before-template=` and `after-template=` which are:

Before `partials/ak_csvtable_before.html.njk`:

```html
<table>
{% if columns and columns.length %}<thead><tr>
{% for col in columns %}<th>{{ col }}</th>{% endfor %}
</tr></thead>{% endif %}
<tbody>
```

After `partials/ak_csvtable_after.html.njk`:

```html
</tbody>
</table>
```

Using only the defaults, `<csv-table file-name="data/people.csv" template="people-row.html.njk"></csv-table>` produces:

```html
<table>
<thead><tr><th>name</th><th>city</th></tr></thead>
<tbody>
... people-row.html.njk rendered for row 1
... people-row.html.njk rendered for row 2
</tbody>
</table>
```

Then, if you want the data as a `<ul>` list

Before `ak_csvtable_ul_before.html.njk`:

```html
<ul>
```

Row template `ak_csvtable_ul_body.html.njk`:

```html
<li>{{ rowNumber }}: {{ name }} lives in {{ city }}</li>
```

After `ak_csvtable_ul_after.html.njk`:

```html
</ul>
```

## Data manipulations

For tables where you want to, or must, output only certain data, the row template can be adjusted appropriately.

For a row you want to, or must, suppress entirely, use an appropriate `{% if %}` statement to detect rows to suppress.  If the row template outputs an empty string, then that row will not appear in the output table.

It's possible to do simple data manipulation as well.  For example you might have a table with columns for _volts_ and _amp-hours_ of energy consumption that you want expressed as kiloWatt-hours.  

```html
<tr>
<!-- other fields -->
<td>{{ volts }}</td>
<tr>{{ ampHours }}</td>
<tr>{{ (volts * ampHours) / 1000 }}</td>
<!-- other fields -->
</tr>
```

Because the templating environment generally does not allow async operations inside a template it's not feasible to do something like language translation, or a database lookup.  Both require consulting external services.

