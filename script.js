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
var isError;

var valideMap = new Map([
    ['percent', false],
    ['replenishmentAmount', false],
    ['depositTerm', false],
    ['depositAmount', false],
    ['startDate', false]
]);

allSelectors.get("replenishmentAmount").addEventListener('input', replenishmentAmountValidate);
allSelectors.get("depositAmount").addEventListener('input', depositAmountValidate);
allSelectors.get("percent").addEventListener('input', percentValidate);
allSelectors.get("depositTerm").addEventListener('input', depositTermValidate);
allSelectors.get("calculate").onclick = calculate;

function getSelectors(inputs) {
    let selectors = new Map();
    for (let i = 0; i < inputs.length; i++) {
        selectors.set(inputs[i].id, inputs[i]);
    }
    return selectors;
}

function replenishmentAmountValidate() {
    let replenishmentAmount = allSelectors.get("replenishmentAmount");
    let isRule = rules(replenishmentAmount, "isOnlyNumber")
            || !rules(replenishmentAmount, "isMaxReplenishmentAmount");

    if (isRule) {
        inValide(replenishmentAmount);
    } else {
        valide(replenishmentAmount);
        replenishmentAmount.disable = true;
    }
}

function depositAmountValidate() {
    let depositAmount = allSelectors.get("depositAmount");
    if (rules(depositAmount, "isEmpty") || !rules(depositAmount, "isMinMaxDepositAmount")) {
        inValide(depositAmount);
    } else {
        valide(depositAmount);
    }
}

function percentValidate() {
    let percent = allSelectors.get("percent");
    if (rules(percent, "isEmpty") || !rules(percent, "isMinMaxPercent")) {
        inValide(percent);
    } else {
        valide(percent);
    }
}

function depositTermValidate() {
    let depositTerm = allSelectors.get("depositTerm");
    if (rules(depositTerm, "isEmpty") || !rules(depositTerm, "isMinMaxDepositTerm")) {
        inValide(depositTerm);
    } else {
        valide(depositTerm);
    }
}

function dateValidate() {
    let startDate = allSelectors.get("startDate");
    if (rules(startDate, "isEmpty")) {
        inValide(startDate);
    } else {
        valide(startDate);
    }
}

function rules(input, arg) {
    switch (arg) {
        case 'isMinMaxDepositAmount':
            if (input.value >= MIN_DEPOSIT_AMOUNT && input.value <= MAX_DEPOSIT_AMOUNT) {
                return true;
            }
            break;
        case 'isMinMaxPercent':
            if (input.value >= MIN_PERCENT && input.value <= MAX_PERCENT) {
                return true;
            }
            break;
        case 'isMaxReplenishmentAmount':
            if (input.value <= MAX_REPLENISHMENT_AMOUNT) {
                return true;
            }
            break;
        case 'isEmpty':
            if (input.value === '') {
                return true;
            }
            break;
        case 'isMinMaxDepositTerm':
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
        case 'onlyNumber':
            if (!/\D+|\.+/.test(input.value)) {
                return true;
            }
            break;
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
    isTextEmpty();
    zero();
    if (!isInvalide()) {
        sendRequest();
    }
}

function isTextEmpty() {
    let inputs = getGroup('._req');
    for (let i = 0; i < inputs.length; i++) {
        if (rules(inputs[i], "isEmpty")) {
            inValide(inputs[i]);
        }
    }
}

function getGroup(key) {
    return document.querySelectorAll(key);
}

function zero() {
    let replenishmentAmount = allSelectors.get("replenishmentAmount");
    if (replenishmentAmount.value === '') {
        replenishmentAmount.value = 0;
    }
}

function isInvalide() {
    for (let amount of valideMap.values()) {
        if (amount === true) {
            return true;
        }
    }
    return false;
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
