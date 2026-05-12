<?php
namespace App;
class JsonEncoder implements EncoderInterface {
    public function encode(mixed $data): string {
        $result = json_encode($data, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
        return $result;
    }

    public function decode(string $input): mixed {
        return json_decode($input, associative: true, flags: JSON_THROW_ON_ERROR);
    }
}