Title: Node members or Node attributes
Slug: node-members-or-node-attributes
Date: 2008-05-29 23:22:17
Lang: en
Tags: dom, html, javascript

Having given it a bit of thought I think that [this problem][1] stems from a slight confusion as to how DOM nodes' attributes work.

You would expect javascript code to execute when you apply it to an attribute:

    someNode.onclick = "alert('foo');";

And you expect this to work because *this is exactly what you do in your HTML*. And in some browsers it does. **Some** browsers.

I don't know another way to say it, maybe there is someone who can fix my terminology but here's the thing: Element attributes are different from node members.

I remember all to well the grief this caused me when I started working with DOMnodes in Javascript. Sooner or later, you will run into these inconsistencies. The browsers also try their best at blurring the difference between attributes and members. Which is helpful when you know how it works.

Consider this CSS:

    input[type="text"][value=""] { background: teal; }

It colors an empty input field. But why doesn't the field update when you type text in the box? `theInput.value` gives you whatever you typed in there.

This is because `.value` is a node member that contains what is displayed in the box, while the actual attribute contents are exposed on `.defaultValue`, which incidentally is what `[value]` is examining (and what is copied to `.value` should the inputs form be reset).

With onclick, the node has a `.onclick` member that is a *reference to* a function (or `null`). When the HTML is parsed into a DOM tree, any code in onclick attributes is turned into an anonymous function and a reference to it is placed on the onclick member of the node.

So why does the following code fail in MSIE?

    someNode.onclick = "alert('foo');";

Because MSIE doesn't evaluate the string as it is placed on the member. The onclick becomes a reference to a string and if the event occurs MSIE will complain because effectively we've just tried to do this:

    "alert('foo');"();

Now, does this make any more sense, or did things suddenly get more complicated?

[1]: http://meyerweb.com/eric/thoughts/2008/05/29/need-help-with-table-row-events/