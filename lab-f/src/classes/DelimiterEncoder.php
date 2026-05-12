<?php
namespace App;
abstract class DelimiterEncoder implements EncoderInterface
{
    abstract protected function delimiter(): string;

    public function encode(mixed $data): string
    {
        $headers = implode($this->delimiter(), array_keys($data[0])) . "\n";
        $rows = '';
        foreach ($data as $row) {
            $rows .= implode($this->delimiter(), array_values($row)) . "\n";
        }
        return rtrim($headers . $rows, "\n");
    }

    public function decode(string $input): mixed {
        $lines = explode("\n", str_replace("\r\n", "\n", trim($input)));
        $headers = str_getcsv(array_shift($lines), $this->delimiter(), escape: '\\');

        return array_map(
            fn($line) => array_combine($headers, str_getcsv($line, $this->delimiter(), escape: '\\')),
            $lines
        );
    }
}