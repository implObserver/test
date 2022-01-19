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
        RUB = '₽',
        RESULT_TEXT = "Сумма к выплате";
var allSelectors = getSelectors(document.querySelectorAll('._sel'));

var valideMap = new Map([
    ['percent', false],
    ['replenishmentAmount', false],
    ['depositTerm', false],
    ['depositAmount', false],
    ['startDate', false]
]);
var inputs = getGroup('._req');
inputs.forEach(input => input.addEventListener('input', () => inputValidate(input.id)));

allSelectors.get("calculate").onclick = calculate;

function getSelectors(inputs) {
    let selectors = new Map();
    for (let i = 0; i < inputs.length; i++) {
        selectors.set(inputs[i].id, inputs[i]);
    }
    return selectors;
}

function getGroup(key) {
    return document.querySelectorAll(key);
}

function inputValidate(id) {
    let input = allSelectors.get(id);
    let isRule = compoundRule(input, "isMinMax_" + id);
    isRule ? inValide(input) : valide(input);
}

function compoundRule(input, arg) {
    return rules(input, "onlyNumber") || !rules(input, arg);
}

function rules(input, arg) {
    switch (arg) {
        case 'isMinMax_startDate':
            return true;
        case 'isMinMax_depositAmount':
            return input.value >= MIN_DEPOSIT_AMOUNT && input.value <= MAX_DEPOSIT_AMOUNT ? true : false;
        case 'isMinMax_percent':
            return input.value >= MIN_PERCENT && input.value <= MAX_PERCENT ? true : false;
        case 'isMinMax_replenishmentAmount':
            return input.value <= MAX_REPLENISHMENT_AMOUNT ? true : false;
        case 'isMinMax_depositTerm':
            if (allSelectors.get("time").value === '1') {
                return input.value >= MIN_MOUNTHS && input.value <= MAX_MOUNTHS ? true : false;
            } else {
                return input.value >= MIN_YEARS && input.value <= MAX_YEARS ? true : false;
            }
        case 'isEmpty':
            let isRule1 = Object.is(input, allSelectors.get("replenishmentAmount"));
            return isRule1 ? false : input.value === '';
        case 'onlyNumber':
            let isRule2 = Object.is(input, allSelectors.get("startDate"));
            return isRule2 ? false : /\D+|\.+/.test(input.value);
    }
}

function inValide(input) {
    formAddError(input);
    setValid(input, true);
    setErrorText(input);
}

function valide(input) {
    formRemoveError(input);
    setValid(input, false);
    deleteErrorText(input);
}

function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

function setValid(input, flag) {
    valideMap.set(input.id, flag);
}

function setErrorText(input) {
    document.querySelector('#' + input.id + 'Exc').textContent = exceptionGetter(input.id);
}

function deleteErrorText(input) {
    document.querySelector('#' + input.id + 'Exc').textContent = '';
}

function exceptionGetter(name) {
    let excList = {
        'percent': "Не менее 3% и не более 100%",
        'replenishmentAmount': "Не более 3000000",
        'depositTerm': " Не менее 1 месяца и не более 5 лет",
        'depositAmount': "Не менее 1000 и не более 3000000",
        'startDate': "Выберите дату"
    };
    return excList[name];
}

function calculate(e) {
    e.preventDefault();
    isTextEmpty()
    if (!isInvalide()) {
        sendRequest();
    }
}

function isTextEmpty() {
    inputs.forEach(input => rules(input, "isEmpty") ? inValide(input) : valide(input));
}

function isInvalide() {
    let isRule = Array.from(valideMap.values()).includes(true);
    return isRule;
}

function sendRequest() {
    let request = new XMLHttpRequest();
    request.open('POST', 'calc.php');
    request.setRequestHeader('Content-Type', 'Content-Type: application/json');
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            outputRequestResponse(request.response);
        }
    };
    request.send(getJSON());
}

function outputRequestResponse(response) {
    allSelectors.get("capRes").textContent = RESULT_TEXT;
    allSelectors.get("result").textContent = RUB + JSON.parse(response)['sum'];
}

function getJSON() {
    let data = JSON.stringify({
        "startDate": allSelectors.get("startDate").value, // дата открытия вклада
        "sum": allSelectors.get("depositAmount").value, // сумма вклада
        "term": yearToMounth(), // срок вклада в месяцах
        "percent": allSelectors.get("percent").value, // процентная ставка, % годовых
        "sumAdd": getReplenishmentAmount() // сумма ежемесячного пополнения вклада
    });
    return data;
}

function yearToMounth() {
    let result = allSelectors.get("depositTerm").value;
    let checkBoxOption = allSelectors.get("time").value;
    return checkBoxOption === '1' ? result : result * MOUNTHS_IN_YEAR;
}

function getReplenishmentAmount() {
    let replenishmentAmount = allSelectors.get("replenishmentAmount");
    return replenishmentAmount.value === '' ? 0 : replenishmentAmount.value;
}

function changeVisibilityCheckBox(checkBox, input) {
    if (document.querySelector(checkBox).checked) {
        document.querySelector(input).style.display = "block";
    } else {
        document.querySelector(input).style.display = "none";
    }
}