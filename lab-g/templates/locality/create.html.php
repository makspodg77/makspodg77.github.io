<?php

/** @var \App\Model\Locality $locality */
/** @var \App\Service\Router $router */

$title = 'Create Locality';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Locality</h1>
    <form action="<?= $router->generatePath('locality-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="locality-create">
    </form>

    <a href="<?= $router->generatePath('locality-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
