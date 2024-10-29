Title: Reboot
Slug: running-on-gannet
Date: 2012-01-30 00:04:00
Lang: en
Tags: gannet, meta, weblog
Status: draft

I have moved this small website to run on a different publishing software. Namely, my own [Gannet][gannet] weblog generator. There are a number of uninteresting reasons why, which I will now proceed delight you with.

I've use a couple of systems to write on this site. I started with my own custom system which had a few incarnations during it's lifetime. This was back when few/no blogging systems existed and rolling ones own seemed like a sane thing to.

That all worked fine but ultimately I decided I was spending too much time keeping it alive and so I moved to [WordPress][wp].

What happened when I switched to WordPress was that I stopped writing things on the page. This may have been a coincidence. I do believe that my older system, with it's inlined editor UI, encouraged my writing but WordPress' approach discouraged it. This would obviously not be the case for the 1000's of other people using WordPress every day. So if this was the case, it may just be that certain style of application detracts from my modivation?

With Gannet: I type the entry out in a basic code editor, commit the plain text file to a [Git][git] repository, and use a [makefile][make] to build and deploy the site (which is completely static). This is what I spend 70% of may waking hours doing anyway so I'm hoping will encourage me to actually write. This is nonsense - of course - I've spent way more time developing the software to run this site than I have writing stuff on it.

My system is influenced and inspired by other static blog generators, [Jekyl][jekyl] & [Pelican][pelican], which I tried out but ultimately I just wanted things to be a certain way and those systems needed patching to do them - and if I'm maintaining software it might as well be my own.

[make]: ...
[gannet]: ...
[wp]: ..
[pelican]: http://docs.notmyidea.org/alexis/pelican/
[jekyl]: ...
[git]: ...
