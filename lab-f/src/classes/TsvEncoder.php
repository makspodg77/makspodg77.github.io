<?php
namespace App;
class TsvEncoder extends DelimiterEncoder {
    protected function delimiter(): string { return "\t"; }
}
