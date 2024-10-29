Title: Safe fun with Object.prototype.
Slug: object-prototype-trick
Date: 2007-11-11 14:07:19
Lang: en
Tags: javascript, programming

Lets look at two "shortcommings" of Javascript in todays browsers. The first is that you should stay away from `Object.prototype` (so as not to [break other peoples programs][1]). The second is that Javascript only has a single thread. We can fix the first using the advantage of the second.

My idea is that if we have a process that would benefit from extending `Object.prototype`, then we can do this during the time we are processing. Afterwards we simply remove the extensions and everything is back to normal.

    Object.prototype.toHTML = htmlGenerationFunction;
    myObject.toHTML();
    delete Object.prototype.toHTML;

This trick won't work on browsers that don't implement the `delete` operator (IE3), and it's going to be a pain if `hasOwnProperty` isn't supported either (Safari 1 and IE5.0). But if you're not supporting those browsers then you can consider this trick ([test yours here][2]).

I've thrown together a [`toJSON` converter using this method][3]. Admittedly, the code is no cleaner than the [original example][4], but it works, will use native methods where available, and proves the concept.

[1]: http://erik.eae.net/archives/2005/06/06/22.13.54/
[2]: /programs/json/
[3]: /programs/json/json.js
[4]: http://www.json.org/json2.js