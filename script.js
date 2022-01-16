/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
function setForm() {
    var chbox;
    var form;
    form = document.getElementById('replAmount');
    chbox = document.getElementById('monthlyReplenishment');
    if (chbox.checked) {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}
document.querySelector('.calculate').onclick = calculate;
var result = document.querySelector('#result');
function calculate() {
    let starDate = document.querySelector('#startDate').value;
    let depositAmount = document.querySelector('#depositAmount').value;
    let percent = document.querySelector('#percent').value;
    let replAmount = document.querySelector('#replAmount').value;
    let depositTerm = document.querySelector('#depositTerm').value;
    let select = document.querySelector('#time');
    var xhr = new XMLHttpRequest();
    if ($.isEmptyObject(replAmount)) {
        replAmount = 0;
    }
    
    xhr.open('POST', 'calc.php');
    xhr.setRequestHeader('Content-Type', 'Content-Type: application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            result.textContent = this.responseText;
        }
    };
    console.log(replAmount)
    var data = JSON.stringify({
        "startDate": starDate, // дата открытия вклада
        "sum": depositAmount, // сумма вклада
        "term": depositTerm, // срок вклада в месяцах
        "percent": percent, // процентная ставка, % годовых
        "sumAdd": replAmount // сумма ежемесячного пополнения вклада
    });
    xhr.send(data);
    return false;
}
function validation(val){
    
}

