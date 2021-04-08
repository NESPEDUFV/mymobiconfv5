all:
	git pull
	sudo /etc/init.d/apache2 reload
