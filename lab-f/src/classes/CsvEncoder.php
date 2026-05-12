<?php
namespace App;
class CsvEncoder extends DelimiterEncoder
{
    protected function delimiter(): string { return ','; }
}