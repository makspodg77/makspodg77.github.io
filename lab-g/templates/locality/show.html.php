<?php

/** @var \App\Model\Locality $locality */
/** @var \App\Service\Router $router */

$title = "{$locality->getName()} ({$locality->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $locality->getName() ?></h1>
    <article>
        <?= $locality->getMunicipality(); ?>
        <?= $locality->getCounty(); ?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('locality-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('locality-edit', ['id'=> $locality->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
