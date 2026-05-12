<?php
namespace App;
class SsvEncoder extends DelimiterEncoder {
    protected function delimiter(): string { return ';'; }
}