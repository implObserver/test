/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

var onlyNumber = /\D+|^\s*$/;
var result = document.querySelector('#result');
document.querySelector('.calculate').onclick = calculate;
function calculate(e) {
    e.preventDefault();
    let sum;
    let rub = '₽';
    let select = document.querySelector('#time');
    let errors = formValidate(select);
    let xhr = new XMLHttpRequest();
    let capRes = document.querySelector('#capRes');
    let percent = document.querySelector('#percent').value;
    let startDate = document.querySelector('#startDate').value;
    let replAmount = document.querySelector('#replAmount').value;
    let depositTerm = document.querySelector('#depositTerm').value;
    let depositAmount = document.querySelector('#depositAmount').value;

    if (select.value === '2') {
        depositTerm = depositTerm * 12;
    }

    var data = JSON.stringify({
        "startDate": startDate, // дата открытия вклада
        "sum": depositAmount, // сумма вклада
        "term": depositTerm, // срок вклада в месяцах
        "percent": percent, // процентная ставка, % годовых
        "sumAdd": replAmount // сумма ежемесячного пополнения вклада
    });

    if (errors === 0) {
        xhr.open('POST', 'calc.php');
        xhr.setRequestHeader('Content-Type', 'Content-Type: application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                capRes.textContent = "Сумма к выплате";
                console.log(xhr.responseText);
                sum = JSON.parse(xhr.response);
                result.textContent = rub + sum['sum'];
            }
        };
        xhr.send(data);
    } else {
        capRes.textContent = '';
        result.textContent = '';
    }
}

function formValidate(select) {
    let error = 0;
    let label = document.querySelectorAll('.exc');
    let formReq = document.querySelectorAll('._req');
    let calendar = document.querySelector('#startDate');
    clearMind(label);

    if ($.isEmptyObject(calendar.value)) {
        formAddError(calendar);
        error += setErr(calendar);
    } else {
        formRemoveError(calendar);
    }

    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        formRemoveError(input);
        if (onlyNumber.test(input.value)) {
            if (input.id !== 'replAmount') {
                formAddError(input);
                error += setErr(input);
            } else {
                input.value = 0;
            }
        } else if (!rules(input, select)) {
            formAddError(input);
            error += setErr(input);
        }
    }
    return error;
}

function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

function rules(input, select) {
    let id = input.id;
    switch (id) {
        case 'depositAmount':
            if (input.value >= 1000 && input.value <= 3000000) {
                return true;
            }
            break;
        case 'percent':
            if (input.value >= 3 && input.value <= 100) {
                return true;
            }
            break;
        case 'replAmount':
            if (input.value <= 3000000) {
                return true;
            }
            break;
        case 'depositTerm':
            if (select.value === '1') {
                if (input.value >= 1 && input.value <= 60) {
                    return true;
                }
            } else {
                if (input.value >= 1 && input.value <= 5) {
                    return true;
                }
            }
            break;
    }
    return false;
}
function excGetter(name) {
    let excList = {
        'percent': "Не менее 3% и не более 100%",
        'replAmount': "Не более 3000000",
        'depositTerm': " Не менее 1 месяца и не более 5 лет",
        'depositAmount': "Не менее 1000 и не более 3000000",
        'startDate': "Выберите дату",
        'other': "Введите целое положительное число"
    };
    return excList[name];
}

function setErr(input) {
    let label = document.querySelector('#' + input.id + 'Exc');
    label.textContent = excGetter(input.id);
    return 1;
}

function setForm() {
    var chbox;
    var text;
    text = document.getElementById('replAmount');
    chbox = document.getElementById('monthlyReplenishment');
    if (chbox.checked) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function clearMind(input) {
    for (let i = 0; i < input.length; i++) {
        input[i].textContent = '';
    }
}