<?php
namespace App;
class YamlEncoder implements EncoderInterface {
    public function encode(mixed $data): string {
        $result = yaml_emit($data, YAML_UTF8_ENCODING);
        return $result;
    }

    public function decode(string $input): mixed {
        return yaml_parse($input);
    }
}