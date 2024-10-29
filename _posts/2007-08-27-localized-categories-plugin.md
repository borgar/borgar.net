Title: Wordpress plugin: Localized categories
Slug: localized-categories-plugin
Date: 2007-08-27 21:51:21
Lang: en
Tags: programming, release, wordpress

I write in two languages, my theme exists in both translations. Yet, theme (or Wordpress) doesn't care to fit one to the other. It was time to do something about that.

What I basically wanted was to be able to place all my English entries into a category, and then attach a locale to that category thus displaying entries in that category with the theme appropriately translated around them.

Other benefits include having an easy way to list out entries from a particular language - in the exact same way entries in other categories are listed out.

Wordpress put up a bit of a fight. It really doesn't like switching locales after the initial preparations are done, but lately the situation has improved to the point that hacking around it is possible.

My only irritation now is not having an action "per entry" to trigger per-entry checking if a swap is needed. But as you can see, if you care to examine this blog, I got around that too.

----

Interested parties may grab the plugin from my subversion repo: [Version 0.1b][1].

Plugin probably requires at least a somewhat current version of Wordpress and a translated, locale aware theme.

[1]: /svn/public/trunk/wordpress/plugins/lang-cats/