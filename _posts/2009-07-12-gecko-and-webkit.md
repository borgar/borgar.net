Title: Gecko & Webkit
Slug: gecko-and-webkit
Date: 2009-07-12 15:46:22
Lang: en
Tags: browser, history, internet

I stumbled over [Zeldman's opening statement][1]:

> When Apple chose Webkit rather than Mozilla Gecko as the basis for its Safari browser, some of us in the web standards community scratched our heads. Sure, Webkit was open-source and standards-compliant.

Really? People were puzzled by this? This always seemed the obvious choice to me. 

First of all, Apple didn't choose WebKit, they chose KHTML to become WebKit. And while Firefox may have been more mature as a browser, the Gecko engine was not mature in ways that mean "sophisticated".

At the time (7-8 years ago today) the Gecko codebase was a notorious mess and the rewrite work only so far along the way. It was such as mess that it was a running joke on Slashdot and cited as a perfect example of the code equivalent of spaghetti. Gecko still needed a completely new text layout handler to do things like '[inline-block display][2]' and '[hyphenation][3]'. 

Additionally, the Mozilla developers' "if you want this feature so much then you are welcome to implement it yourself" vitriol towards web developers wasn't much better than the apathy Microsoft had. And while it was certainly technically right, it was neither reasonable nor to their credit. But that may not have been so much a factor for Apple.

KHTML, on the other hand, was in heavy development with a much fresher codebase and had nice things that only IE supported, like right-to-left language text. Things that are important to corporations that intend to sell computers to the millions of non-english speakers of the world.

From a purely technical point of view KHTML was a much better choice. Dave Hyatt, who probably had a large say in the selecting KHTML to become WebKit, knew this all to well having worked with, and written some of, the mess Gecko was at the time. 

Time passes and we may not remember all of this so clearly or, as things change, these things cease to matter. I am a bit surprised to hear that web developers, even heavy weights like Zeldman, were unaware of the state of the browsers they worked on. Are they still?

[1]: http://www.zeldman.com/2009/07/12/web-standards-secret-sauce-webkit-in-iphone/
[2]: https://bugzilla.mozilla.org/show_bug.cgi?id=9458
[3]: https://bugzilla.mozilla.org/show_bug.cgi?id=9101