Title: JSON for old PHP installations
Slug: simplejson
Date: 2008-06-15 14:30:07
Lang: en
Tags: code, json, php, programming, release

I use PHP a lot. Mostly to work with [existing products][1], or to create mockups of things that will get replaced with something else later.

The great thing about PHP is that it is present in some form on nearly all servers. If you're careful to avoid version 5 features then you can pretty much expect your code to run wherever.

For a recent prototype I needed [JSON][2] (which wasn't introduced to PHP until version 5) on a 4.3 system. Being a relentless do-it-yourself'er I have written a tiny JSON functionality "library" for older versions of PHP.

It's about 5k of mostly comments. Available under MIT licence from [Google code][3]. Have fun.

[1]: http://wordpress.org/ "Wordpress"
[2]: http://www.json.org/
[3]: http://code.google.com/p/simplejson-php/ "Simple JSON for PHP"