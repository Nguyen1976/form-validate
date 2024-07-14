//Hàm validator
function Validator(options) {//Người xác nhận
    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {//xem thằng input có cùng cha với thằng form group hay k
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};//Để lưu tất cả những cái rule vào trong 
    //Thực hiện việc nhận ra lỗi và bỏ lỗi đi
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        //Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule và kiểm tra
        //Lỗi có lỗi thì dừng vc kiểm tra
        for(var i = 0; i < rules.length; ++i) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) {
                break;
            }
        }

        if(errorMessage) {//Nếu có lỗi
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }

    //Lấy element form cần validate
    var formElement = document.querySelector('form');

    if(formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormVlaid = true;


            //Thực hiện lặp qua từng rule và validate
            options.rules.forEach((rule) => {//Lặp qua để lấy các input selector
                var inputElement = formElement.querySelector(rule.selector);//Tìm input trong form
                var isVadlid = validate(inputElement, rule);
                if(!isVadlid) {
                    isFormVlaid = false;            
                } 
            });

            if(isFormVlaid) {
                //Trường hợp submit với javascript
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name=' + input.name + ']:checked').value;
                                break
                            case 'checkbox':
                                if(input.matches(':checked')) {
                                    values[input.name] = [];
                                    return values;
                                } 
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);

                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});

                    options.onSubmit(formValues);
                } else {//submit với hành vi mặc định
                    formElement.submit();
                }
            }
        }

        //Xử lý lặp qua mỗi rule 
        options.rules.forEach((rule) => {


            //Lưu lại tất cả cả rule trong mỗi ô input
            selectorRules[rule.selector] = rule.test;

            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);//Tìm input trong form
            Array.from(inputElements).forEach((inputElement) => {
                if(inputElement) {
                    //Tức là click ra ngoài thẻ input
                    inputElement.onblur = function() {//Tức là click ra ngoài thẻ input
                        validate(inputElement, rule);
                    }
    
    
                    //Xử lý mỗi khi người dùng nhập vào input
                    inputElement.oninput = function() {
                        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                        errorElement.innerHTML = '';
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                    }
                }
            })
        });
    }
}

//Định nghĩa các rules
//Nguyên tắc của rules
//1. Khi có lỗi trả ra message trả ra msg lỗi
//2. Khi không có lỗi trả về undefined
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {//Để ktra người dùng đã nhập chưa
            return value ? undefined : message || 'Vui lòng nhập trường này';//trim() để loaoij bỏ tất cả dấu cách
        }
    };
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {//Để ktra xem có phải email không
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Email không hợp lệ';//trim() để loaoij bỏ tất cả dấu cách
        }
    };
}

Validator.minLenght = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {//Để ktra xem có phải email không
            return value.length > min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {//Để ktra xem có phải nhập giống nhau với input khác
            return value === getConfirmValue() ? undefined : message  || 'Giá trị nhập vào không chính xác';
        }
    }
}