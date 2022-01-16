/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
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
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.calculate').onclick = calculate;
    var result = document.querySelector('#result');
    function calculate(e) {
        e.preventDefault();
        let select = document.querySelector('#time');
        let errors = formValidate(select);
        let startDate = document.querySelector('#startDate').value;
        let depositAmount = document.querySelector('#depositAmount').value;
        let percent = document.querySelector('#percent').value;
        let replAmount = document.querySelector('#replAmount').value;
        let depositTerm = document.querySelector('#depositTerm').value;
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
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'calc.php');
            xhr.setRequestHeader('Content-Type', 'Content-Type: application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    result.textContent = this.responseText;
                }
            };
            xhr.send(data);
        } else {
            result.textContent = '';
        }
    }
});

function formValidate(select) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');
    let calendar = document.querySelector('#startDate');
    
    formRemoveError(calendar);
    if ($.isEmptyObject(calendar.value)) {
        formAddError(calendar);
        error++;
    } else {
        formRemoveError(calendar);
    }
    
    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);
        if (/\D+|^\s*$/.test(input.value)) {
            formAddError(input);
            error++;
            if(input.id === 'replAmount') {              
                formRemoveError(input);
                error--;
                input.value = 0;
            }
        } else if (!rules(input, select)) {
            formAddError(input);
            error++;      
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
    console.log(id);
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