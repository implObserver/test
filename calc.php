<?php

header("Content-Type: application/json");

const daysY = 365;
const convert = 100;

$data = json_decode(file_get_contents("php://input"), true);
$date = date_parse_from_format("j.n.Y", $data['startDate']);
$depAmount = $data['sum'];
$percent = $data['percent'];
$replAmount = $data['sumAdd'];
$curMonth = $date["month"];
$daysInMonth = array(
    1 => 31,
    2 => 28,
    3 => 31,
    4 => 30,
    5 => 31,
    6 => 30,
    7 => 31,
    8 => 31,
    9 => 30,
    10 => 31,
    11 => 30,
    12 => 31
);

for ($i = 0; $i < $data["term"]; $i++) {
    $depAmount += $replAmount + ($depAmount * $daysInMonth[$curMonth] * ($percent / daysY)) / convert;
    if ($curMonth < 12) {
        $curMonth++;
    } else {
        $curMonth = 1;
    }
}

echo round($depAmount, 2);
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

