/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

const   MOUNTHS_IN_YEAR = 12,
        MIN_DEPOSIT_AMOUNT = 1000,
        MAX_DEPOSIT_AMOUNT = 3000000,
        MIN_PERCENT = 3,
        MAX_PERCENT = 100,
        MAX_REPLENISHMENT_AMOUNT = 3000000,
        MIN_MOUNTHS = 1,
        MAX_MOUNTHS = 60,
        MIN_YEARS = 1,
        MAX_YEARS = 5,
        RUB = '₽';

var allSelectors = getSelectors(document.querySelectorAll('._sel'));
var onlyNumber = /\D+|^\s*$/;
var isError;

allSelectors.get("calculate").onclick = calculate;
function calculate(e) {
    e.preventDefault();
    isError = false;
    formValidate();
    if (!isError) {
        sendRequest();
    } else {
        allSelectors.get("capRes").textContent = '';
        allSelectors.get("result").textContent = '';
    }
}

function getSelectors(inputs) {
    let selectors = new Map();
    for (let i = 0; i < inputs.length; i++) {
        selectors.set(inputs[i].id, inputs[i]);
    }
    return selectors;
}

function formValidate() {
    clearFields('.exc');
    dateValidate();
    replenishmentAmountValidate();
    requirementInputValidate();
}

function clearFields(input) {
    let fields = document.querySelectorAll(input);
    for (let i = 0; i < fields.length; i++) {
        fields[i].textContent = '';
    }
}

function dateValidate() {
    if ($.isEmptyObject(allSelectors.get("startDate").value)) {
        formAddError(allSelectors.get("startDate"));
        isError = true;
        setErrorText(allSelectors.get("startDate"));
    } else {
        formRemoveError(allSelectors.get("startDate"));
    }
}

function replenishmentAmountValidate() {
    if (onlyNumber.test(allSelectors.get("replenishmentAmount").value)) {
        allSelectors.get("replenishmentAmount").value = 0;
    }
}

function requirementInputValidate() {
    let formReq = document.querySelectorAll('._req');
   
    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];       
        formRemoveError(input);
        
        if (onlyNumber.test(input.value)) {
            formAddError(input);
            isError = true;
            setErrorText(input);
        } else if (!rules(input)) {
            formAddError(input);
            isError = true;
            setErrorText(input);
        }
    }
}

function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

function setErrorText(input) {
    document.querySelector('#' + input.id + 'Exc').textContent = exceptionGetter(input.id);
}

function exceptionGetter(name) {
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

function rules(input) {
    let id = input.id;
    switch (id) {
        case 'depositAmount':
            if (input.value >= MIN_DEPOSIT_AMOUNT && input.value <= MAX_DEPOSIT_AMOUNT) {
                return true;
            }
            break;
        case 'percent':
            if (input.value >= MIN_PERCENT && input.value <= MAX_PERCENT) {
                return true;
            }
            break;
        case 'replenishmentAmount':
            if (input.value <= MAX_REPLENISHMENT_AMOUNT) {
                return true;
            }
            break;
        case 'depositTerm':
            if (allSelectors.get("time").value === '1') {
                if (input.value >= MIN_MOUNTHS && input.value <= MAX_MOUNTHS) {
                    return true;
                }
            } else {
                if (input.value >= MIN_YEARS && input.value <= MAX_YEARS) {
                    return true;
                }
            }
            break;
    }
    return false;
}

function sendRequest() {
    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open('POST', 'calc.php');
    xmlHttpRequest.setRequestHeader('Content-Type', 'Content-Type: application/json');

    xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            allSelectors.get("capRes").textContent = "Сумма к выплате";
            allSelectors.get("result").textContent = RUB + JSON.parse(xmlHttpRequest.response)['sum'];
        }
    };

    xmlHttpRequest.send(getJSON());
}

function getJSON() {
    let data = JSON.stringify({
        "startDate": allSelectors.get("startDate").value, // дата открытия вклада
        "sum": allSelectors.get("depositAmount").value, // сумма вклада
        "term": yearToMounth(), // срок вклада в месяцах
        "percent": allSelectors.get("percent").value, // процентная ставка, % годовых
        "sumAdd": allSelectors.get("replenishmentAmount").value // сумма ежемесячного пополнения вклада
    });
    return data;
}

function yearToMounth() {
    result = allSelectors.get("depositTerm").value;
    if (allSelectors.get("time").value === '2') {
        result *= 12;
    }
    return result;
}

function changeVisibilityCheckBox(checkBox, input) {
    if (document.querySelector(checkBox).checked) {
        document.querySelector(input).style.display = "block";
    } else {
        document.querySelector(input).style.display = "none";
    }
}
