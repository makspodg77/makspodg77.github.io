<?php

/** @var \App\Model\Locality $locality */
/** @var \App\Service\Router $router */

$title = "Edit Locality {$locality->getName()} ({$locality->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('locality-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="locality-edit">
        <input type="hidden" name="id" value="<?= $locality->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('locality-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('locality-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="locality-delete">
                <input type="hidden" name="id" value="<?= $locality->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
