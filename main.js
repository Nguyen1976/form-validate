//Hàm validator
function Validator(options) {//Người xác nhận


    //Thực hiện việc nhận ra lỗi và bỏ lỗi đi
    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        if(errorMessage) {//Nếu có lỗi
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    //Lấy element form cần validate
    var formElement = document.querySelector('form');

    if(formElement) {
        options.rules.forEach((rule) => {
            var inputElement = formElement.querySelector(rule.selector);//Tìm input trong form

            if(inputElement) {
                //Tức là click ra ngoài thẻ input
                inputElement.onblur = function() {//Tức là click ra ngoài thẻ input
                    validate(inputElement, rule);
                }


                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}

//Định nghĩa các rules
//Nguyên tắc của rules
//1. Khi có lỗi trả ra message trả ra msg lỗi
//2. Khi không có lỗi trả về undefined
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {//Để ktra người dùng đã nhập chưa
            return value.trim() ? undefined : 'Vui lòng nhập trường này';//trim() để loaoij bỏ tất cả dấu cách
        }
    };
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {//Để ktra xem có phải email không
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Email không hợp lệ';//trim() để loaoij bỏ tất cả dấu cách
        }
    };
}

Validator.minLenght = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {//Để ktra xem có phải email không
            return value.length > min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

