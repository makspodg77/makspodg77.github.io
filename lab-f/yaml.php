<?php
$data = [
    'name' => 'Maksymilian Podgórski',
    'index' => '57820',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;