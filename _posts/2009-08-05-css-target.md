Title: CSS :target
Slug: css-target
Date: 2009-08-05 23:24:23
Lang: en
Tags: code, javascript, jquery, programming

[jQuery][1] (or [Sizzle][2]) supports `:target` in browsers where it runs [querySelectorAll][3] to handle the work. In older browsers, it doesn't offer fallback support. I guess that this is simply because `:target` is such an uncommon selector?

I have no idea why you would want to use it, but because I have this selector extension and nowhere to put it, here it is:

    jQuery.expr[':'].target = function ( a, h ) {
      return (a.id && (h = document.location.hash) && h === '#' + a.id)
    };

Updated 6. aug. 2009: [Optimized by @maranomynet][4]

[1]: http://docs.jquery.com/Selectors
[2]: http://sizzlejs.com/
[3]: http://www.w3.org/TR/selectors-api/
[4]: http://twitter.com/maranomynet/status/3156396467