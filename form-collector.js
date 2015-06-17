/**
 * Created by fabiandarga on 08.04.2015.
 *
 * This module collects data (text and numbers) as if it was a form.
 * Features:
 *  * Mimic Form-Field behaviour when setting/changing data
 *  * return form data in the same manner as a html form element would
 *
 * var FormCollector = require('form-collector');
 * var myCollector = FormCollector.create();
 * //... add some data
 * // then export the whole form to send it via post
 * var postData = myCollector.getDataArray();
 * // Or export in a json -friendly format
 * var jsonData = myCollector.getJsonData();
 */
/**
 * @module FormCollector
 */
define(function(){
    var exports = {
        /** @returns {FormCollector}  */
        create: function(){
            return new FormCollector();
        },
        /** @enum    */
        FIELD_TYPES: {
            SELECT: 'SELECT',
            MULTI_SELECT: 'MULTI_SELECT',
            TEXT: 'TEXT',
            NUMBER: 'NUMBER',
            RADIO: 'RADIO',
            CHECKBOX: 'CHECKBOX',
            KEY_VALUE: 'KEY_VALUE' // non-standard type
        }
    };

    /**
     * @constructor
     * @name FormCollector
     */
    var FormCollector = function () {

    };

    FormCollector.prototype = {
        /** @private */
        data: {},
        /**
         * @public
         * @returns {Array}
         */
        getDataArray: function () {
            var arr = [];
            var data = this.data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    arr = arr.concat( this.fieldToArray( data[key] ) );
                }
            }
            return arr;
        },
        getJSONObject: function(data) {
            var obj = {}, i;
            var data = this.data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var field = data[key];
                    var value = field.value;
                    if (Array.isArray(value)){
                        var arr = [];
                        for (i = 0; i < value.length; i++) {
                            arr.push( value[i] );
                        }
                        obj[key] = arr;
                    } else if (typeof value != null) {
                        obj[key] = value;
                    }
                }
            }
            return obj;
        },
        /**
         * @private
         * @param field
         * @returns {Array.<{name:String, value:*}>}
         */
        fieldToArray: function (field) {
            var arr = [],
                value = field.value;
            if (Array.isArray(value)){
                for (var i = 0; i < value.length; i++) {
                    arr.push( {name: field.name + '[]', value: value[i]} );
                }
            } else if (typeof value != null) {
                arr.push( {name: field.name, value: value} );
            }
            return arr;
        },
        /**
         * @private
         * @param type
         * @param name
         */
        initField: function(name, type){
            if (this.data[name] && this.data[name].type !== type) {
               throw new Error('FormCollector:setData - trying to use wrong type with existing field.');
            }
            if (!this.data[name]) {
                var field = Field.create(type, name);
                this.data[name] = field;
                switch (type) {
                    case exports.FIELD_TYPES.MULTI_SELECT:
                        field.value = [];
                        break;
                    case exports.FIELD_TYPES.KEY_VALUE:
                        field.value = {};
                }
            }
        },
        /**
         * @param name
         * @param value
         * @param toggle if the known value is already the given value it will be removed
         */
        setDataForSelect: function (name, value, toggle) {
            this.initField(name, exports.FIELD_TYPES.SELECT);

            if (this.data[name].value != value) {
                this.data[name].value = value;
            } else if (toggle) {
                this.data[name].value = null;
            }
            if (window["show_debug"])
                console.log('DEBUG: data = ' + JSON.stringify(this.data[name]));
        },
        /**
         * @param name
         * @param value the value to add/remove
         * @param toggle should it be removed if it exists
         */
        setDataForMultiSelect: function(name, value, toggle) {
            this.initField(name, exports.FIELD_TYPES.MULTI_SELECT);

            var values = this.data[name].value;
            var indexOf = values.indexOf(value);
            if (indexOf == -1) {
                // insert value
                values.push(value);
            } else if (toggle) {
                // remove value
                values.splice(indexOf, 1);
            }
            if (window["show_debug"])
                console.log('DEBUG: data = ' + JSON.stringify(this.data[name]));
        },
        setDataForKeyValue: function (name, key, value, toggle) {
            this.initField(name, exports.FIELD_TYPES.KEY_VALUE);

            var values = this.data[name].value;
            if (toggle && values[key] && values[key] == value) {
                delete values[key];
            } else {
                values[key] = value;
            }
            if (window["show_debug"])
                console.log('DEBUG: data = ' + JSON.stringify(this.data[name]));
        }
    };

    var Field = {
        /**
         * @param type
         * @returns {{type: exports.FIELD_TYPES, value: *|null, name: String}}
         */
        create: function(type, name){
            return {type:type, value:null, name:name};
        }
    };

    return exports;
});
