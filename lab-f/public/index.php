<?php
declare(strict_types=1);
require_once __DIR__ . '/../autoload.php';

use App\Converter;
use App\JsonEncoder;
use App\YamlEncoder;
use App\CsvEncoder;
use App\TsvEncoder;
use App\SsvEncoder;

$encoders = [
        'json' => new JsonEncoder(),
        'yaml' => new YamlEncoder(),
        'csv'  => new CsvEncoder(),
        'tsv'  => new TsvEncoder(),
        'ssv'  => new SsvEncoder(),
];

$title = 'Format Converter';

$result = null;
$error  = null;

$input = $_POST['input'] ?? $_COOKIE['last_input'] ?? '';
$from  = $_POST['from']  ?? $_COOKIE['last_from']  ?? 'json';
$to    = $_POST['to']    ?? $_COOKIE['last_to']    ?? 'yaml';
$result = $_COOKIE['last_result'] ?? null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    setcookie('last_input', $input, time() + (86400 * 30), '/');
    setcookie('last_from',  $from,  time() + (86400 * 30), '/');
    setcookie('last_to',    $to,    time() + (86400 * 30), '/');

    if (!isset($encoders[$from], $encoders[$to])) {
        $error = 'Invalid format selected.';
    } elseif ($input === '') {
        $error = 'Input cannot be empty.';
    } else {
        try {
            $converter = new Converter($encoders[$from], $encoders[$to]);
            $result = $converter->convert($input);
            setcookie('last_result', $result, time() + (86400 * 30), '/');
        } catch (\Exception $e) {
            $error = 'Conversion failed: ' . $e->getMessage();
        }
    }
}

require __DIR__ . '/../src/layouts/layout.php';