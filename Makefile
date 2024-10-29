#
# Makefile for Borgar.net
#

ENV = ~/.virtualenv/borgar.net

site:
	@~/Sites/borgar-github/node-gannet/bin/gannet --settings=settings.conf

test:
	@~/Sites/borgar-github/node-gannet/bin/gannet --settings=settings.conf --verbose --server

clean:
	@@rm -r site

live:
	@rsync -auzI --exclude=".DS_Store" ./site/* borgar@borgar.net:~/public_html

.PHONY: site live
