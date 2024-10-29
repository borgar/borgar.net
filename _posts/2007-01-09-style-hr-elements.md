Title: Replacing HR elements with images
Slug: style-hr-elements
Date: 2007-01-09 14:52:22
Lang: en
Tags: css, hack, html, msie

Yesterday I was presented with the problem of using an image for the `HR` tag. Quick googling confirmed my suspicion, that this is something a lot of people want to achieve but apparently [it can't be done][1] because of, as usual, IE's limitations.

The recommendations seem to be to either [wrap the `HR` in a div][2] and styling that, or just simply work around it by not using images. But of course it can be done, and here's how:

We start with some nice clean code for all the "alternative" browsers:

    hr {
      border : 0;
      height : 15px;
      background : url(hr.gif) 0 0 no-repeat;
      margin : 1em 0;
    }

This seems to work for all standards compliant modern browsers. I've tested it on Opera, Safari & Firefox. However, it does not work on Explorer. IE treats the element as inline and demands a border around it and a minimum height of 1px.

IE supports very basic generated content with the `list-style-image` setting when combined with `display: list-item`. This is what I've used to get around the limitations.

Add this into conditional comments (or hacks if you prefer) to shift the element out of the way and insert a bullet picture in the resulting space:

    hr {
      display : list-item;
      list-style : url(hr.gif) inside;
      filter : alpha(opacity=0);
      width : 0;
    }

<del>My implementation here has the limitation of demanding that the image you use is equal to the width of the text area, but this should be easy to get around or customize.</del>

<del>The border setting can be replaced with a `color: #fff;`. To kill the default border you must set either one to the background color. Possibly it might be shifted out of hidden overflow but I have not tried it.</del>

You can view a live example [here][3].

**Updated - 16. 1. 2007:**

I've updated this entry and the example with the [improvements suggested by Már][4]. There are no longer any limitations on this technique.

[1]: http://www.sovavsiti.cz/css/hr.html "Styling HR with CSS"
[2]: http://bitesizestandards.com/bites/styling-horizontal-rules-with-css "Styling horizontal rules with CSS"
[3]: /files/hr-example/ "A live example of this technique"
[4]: http://mar.anomy.net/entry/2007/01/14/00.37.48/