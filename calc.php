<?php

header("Content-Type: application/json");

const daysY = 365;
const convert = 100;
const countMounth = 12;
try {
    $data = json_decode(file_get_contents("php://input"), true);
    $date = date_parse_from_format("j.n.Y", $data['startDate']);
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
    
    $depAmount = $data['sum'];
    $percent = $data['percent'];
    $replAmount = $data['sumAdd'];
    $term = $data['term'];
    
    $isDepAmount = $depAmount >= 1000 && $depAmount <= 3000000;
    $isPercent = $percent >= 3 && $percent <= 100;
    $isTerm = $term <= 60;
    $isReplAmount = $replAmount <= 3000000;
    
    $date_pattern = '#(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d#';
    $isDate = preg_match($date_pattern, $data['startDate']);
    
    if ($isDepAmount && $isPercent && $isTerm && $isReplAmount && $isDate) {
        for ($i = 0; $i < $term; $i++) {
            $depAmount += $replAmount + ($depAmount * $daysInMonth[$curMonth] * ($percent / daysY)) / convert;
            if ($curMonth < countMounth) {
                $curMonth++;
            } else {
                $curMonth = 1;
            }
        }

        $result = array('sum' => round($depAmount, 2));
        echo json_encode($result);
    }
} catch (DivisionByZeroError $e) {
    echo "На ноль делить нельзя";
} catch (ArithmeticError $e) {
    echo "Ошибка при выполнении арифметической операции";
} catch (ParseError $e) {
    echo "Произошла ошибка парсинга";
} catch (TypeError $e) {
    echo "Неверный тип данных";
} catch (Exception $e) {
    echo "Произошло исключение";
} catch (Error $e) {
    echo "Произошла ошибка";
} catch (Throwable $e) {
    echo "Ошибка при выполнении программы";
}

