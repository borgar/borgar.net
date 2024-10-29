Title: Safari CSS parser bug
Slug: safari-css-parser-bug
Date: 2006-09-13 18:03:12
Lang: en
Tags: browser, bug, hacking, internet, programming, safari

Here is a [Safari][1] CSS parser bug I found today:

    .i {border:0;.i}

Put this invalid code anywhere in your css file and the parser will come to a grinding halt and look no further down the file. Another fine reason to validate your code.

This may work as a hack as things placed below it will not show up in Safari 2.0.4 (419.3). I wouldn't recommend it though. I haven't done much testing but a recent [Konqueror][2] I hastily tried it on was unaffected.

[Expected behaviour][3] is that the browser ignores the text following the `;` and perhaps the next rule following until it finds `;` or `}` again.

[1]: http://www.apple.com/macosx/features/safari/ "The Safari Webbrowser"
[2]: http://www.konqueror.org/ "The Konqueror Webbrowser"
[3]: http://www.w3.org/TR/REC-CSS2/syndata.html "Read: CSS2 syntax and basic data types"