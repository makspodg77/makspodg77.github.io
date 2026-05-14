<?php

/** @var \App\Model\Locality[] $localities */
/** @var \App\Service\Router $router */

$title = 'Locality List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Locality List</h1>

    <a href="<?= $router->generatePath('locality-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($localities as $locality): ?>
            <li><h3><?= $locality->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('locality-show', ['id' => $locality->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('locality-edit', ['id' => $locality->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
