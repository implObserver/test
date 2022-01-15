/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
function setForm() {
var chbox;
var form;
form = document.getElementById('replAmount');
chbox=document.getElementById('monthlyReplenishment');
	if (chbox.checked) {
		form.style.display = "block";
	}
	else {
		form.style.display = "none";
	}
}
