lint:
	npx eslint --fix src/js/main.js
	npx eslint --fix src/js/validator.js

start:
	npx webpack serve