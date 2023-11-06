export default {
    validateFormData(formData) {
        var vm = this;
        var validatedFormData = {};
        var isFormValid = true;
        for (const fieldName in formData) {
            if (Object.hasOwnProperty.call(formData, fieldName)) {
                var fieldConfig = formData[fieldName];
                var results = vm.validateInput(fieldConfig, formData);
                validatedFormData[fieldName] = {
                    ...fieldConfig,
                    errors: results === true ? [] : results,
                    isValid: results === true
                }
                if (results !== true) {
                    isFormValid = false;
                }
            }
        }
        return {
            isValid: isFormValid,
            formData: validatedFormData
        }
    },
    validateInput(inputField, formData) {
        var vm = this;
        var errors = [];
        var val = inputField.value;
        var validations = inputField.validations;
        for (const validationName in validations) {
            if (Object.hasOwnProperty.call(validations, validationName)) {
                const validationConfig = validations[validationName];
                var results = vm[validationName](val, validationConfig, formData);
                if (results !== true) {
                    errors.push(results);
                }
            }
        }
        return errors.length > 0 ? errors : true;
    },
    required(val, config, formData) {
        if (typeof config == 'string') {
            config = {
                error: config,
                trim: false,
                wrongValues: [""]
            };
        }
        if (typeof val == 'undefined' || val == null) {
            return config.error;
        }
        if (typeof val == 'string') {
            val = config.trim ? val.trim() : val;
            if (val.length == 0 || (config.wrongValues && config.wrongValues.indexOf(val) >= 0)) {
                return config.error;
            } else {
                return true;
            }
        } else if (Array.isArray(val)) {
            if (val.length == 0) {
                return config.error;
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    maxLength(val, config, formData) {
        if (!config.trim) {
            config["trim"] = false;
        }
        if(typeof val == 'number'){
            val = val.toString();
        }
        if (typeof val == 'string' || Array.isArray(val)) {
            if (config.trim == true) {
                val = val.trim ? val.trim() : val;
            }
            if (val.length > config.value) {
                return config.error;
            } else {
                return true;
            }
        } else if (typeof val == undefined || val == null) {
            return config.error;
        } else {
            return "Expected a string or array value  ";
        }
    },
    minLength(val, config, formData) {
        if (!config.trim) {
            config["trim"] = false;
        }
        if (typeof val == 'string' || Array.isArray(val)) {
            if (config.trim == true) {
                val = val.trim ? val.trim() : val;
            }
            if (val.length < config.value) {
                return config.error;
            } else {
                return true;
            }
        } else if (typeof val == undefined || val == null) {
            return config.error;
        } else {
            return "Expected a string or array value";
        }
    },
    length(val, config, formData) {
        if (typeof val == 'number') {
            val = String(val);
        }
        if (!config.trim) {
            config["trim"] = false;
        }
        if (typeof val == 'string' || Array.isArray(val)) {
            if (config.trim == true) {
                val = val.trim ? val.trim() : val;
            }
            if (val.length != config.value) {
                return config.error;
            } else {
                return true;
            }
        } else if (typeof val == undefined || val == null) {
            return config.error;
        } else {
            return "Expected a string or array value";
        }
    },
    emailFormat(val, config, formData) {
        if (typeof config == 'string') {
            config = {
                error: config
            };
        }
        if (config.ignoreIfEmpty && typeof val == 'string' && (val = val.trim()).length == 0) {
            return true;
        }
        if (typeof val != 'string') {
            return config.error;
        }
        var res = val.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (res) {
            return true;
        } else {
            return config.error;
        }
    },
    digitsOnly(val, config, formData) {
        if (typeof config == 'string') {
            config = {
                error: config
            };
        }
        val = String(val);
        if (typeof val != 'string') {
            return config.error;
        }
        var res = val.toLowerCase().match(/^\d+$/);
        if (res) {
            return true;
        } else {
            return config.error;
        }
    },
    sameAs(val, config, formData) {
        var targetValue = formData[config.value].value;
        if (val === targetValue) {
            return true;
        } else {
            return config.error;
        }
    },
    extraField(val, config, formData) {
        if (typeof config == 'string') {
            config = {
                error: config,
                trim: false,
                wrongValues: []
            };
        }
        if (typeof val == 'undefined' || val == null) {
            return config.error;
        }
        if (typeof val == 'string') {
            val = config.trim ? val.trim() : val;
            if(val.length == 0){
                return true;
            }
            var parts = val.split(":");
            if (val.indexOf("[") == 0 || val.indexOf("]") == (val.length - 1)) {
                return config.error;
            } else if (parts.length != 2) {
                return config.error;
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    standardDateFormatStr(val, config, formData) {
        //https://bobbyhadz.com/blog/javascript-validate-date-yyyy-mm-dd
        if (typeof config == 'string') {
            config = {
                error: config,
                ignoreIfEmpty: false
            };
        }
        if (config.ignoreIfEmpty && typeof val == 'string' && (val = val.trim()).length == 0) {
            return true;
        }
        if (typeof val != 'string') {
            return config.error;
        }
        var res = val.toLowerCase().match(
            /^\d{4}-\d{2}-\d{2}$/
        );
        if (res) {
            const date = new Date(val);
            const timestamp = date.getTime();
            if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
                return config.error;
            } else {
                if (date.toISOString().startsWith(val)) {
                    return true;
                } else {
                    return config.error;
                }
            }
        } else {
            return config.error;
        }
    },
    inList(val, config, formData) {
        if (Object.hasOwnProperty.call(config, "ignoreIfEmpty") == false) {
            config["ignoreIfEmpty"] = false;
        }
        if (config.ignoreIfEmpty && typeof val == 'string' && (val = val.trim()).length == 0) {
            return true;
        }
        if(config.value.indexOf(val) < 0){
            return config.error;
        }
        return true;
    },
    phoneFormat(val, config, formData) {
        if (typeof config == 'string') {
            config = {
                error: config
            };
        }
        if (config.ignoreIfEmpty && typeof val == 'string' && (val = val.trim()).length == 0) {
            return true;
        }
        if (typeof val != 'string') {
            return config.error;
        }
        var res = val.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (res) {
            return true;
        } else {
            return config.error;
        }
    },
}