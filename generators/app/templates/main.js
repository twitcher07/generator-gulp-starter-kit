<%_ if (includeJQuery || includeBootstrap) { -%>
import $ from 'jquery';
<%_ } -%>

<%_ if (includeBootstrap) { -%>
import 'popper.js';
import 'bootstrap';
<%_ } -%>

console.log('Hello World 😎');

// Example of Babel.js transpiling
// Babel Input: ES2015 arrow function
[1, 2, 3].map((n) => n + 1);

<%_ if (includeJQuery || includeBootstrap) { -%>
$(document).ready( () => {
	
	//insert jquery here

});
<%_ } -%>