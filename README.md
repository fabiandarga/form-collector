# form-collector
A small JavaScript Module

This module collects data (text and numbers) as if it was a form.

Features:
 * Mimic Form-Field behaviour when setting/changing data
 * return form data in the same manner as a html form element would
```
var FormCollector = require('form-collector');
var myCollector = FormCollector.create();
//... add some data
// then export the whole form to send it via post
var postData = myCollector.getDataArray();
// Or export in a json -friendly format
var jsonData = myCollector.getJsonData();
```
