<?php
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDirs = [
        __DIR__ . '/src/classes/',
        __DIR__ . '/src/interfaces/',
    ];

    if (strpos($class, $prefix) !== 0) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $relative = str_replace('\\', '/', $relative) . '.php';

    foreach ($baseDirs as $baseDir) {
        $file = $baseDir . $relative;
        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});