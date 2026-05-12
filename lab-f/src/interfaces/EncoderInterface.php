<?php
namespace App;
interface EncoderInterface {
    public function encode(mixed $data): string;
    public function decode(string $input): mixed;
}
