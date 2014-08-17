PROJECT_MODULES_PATH = $(shell cd modules && pwd)

build:
	YENV=production ./node_modules/enb/bin/enb make -n
