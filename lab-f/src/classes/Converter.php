<?php
namespace App;
class Converter {
    public function __construct(
        private EncoderInterface $from,
        private EncoderInterface $to,
    ) {}

    public function convert(string $input): string {
        $decoded = $this->from->decode($input);
        return $this->to->encode($decoded);
    }
}