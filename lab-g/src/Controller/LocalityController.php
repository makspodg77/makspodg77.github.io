<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Locality;
use App\Model\Post;
use App\Service\Router;
use App\Service\Templating;

class LocalityController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $localities = Locality::findAll();
        $html = $templating->render('locality/index.html.php', [
            'localities' => $localities,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestLocality, Templating $templating, Router $router): ?string
    {
        if ($requestLocality) {
            $locality = Locality::fromArray($requestLocality);
            // @todo missing validation
            $locality->save();

            $path = $router->generatePath('locality-index');
            $router->redirect($path);
            return null;
        } else {
            $locality = new Locality();
        }

        $html = $templating->render('locality/create.html.php', [
            'locality' => $locality,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $localityId, ?array $requestLocality, Templating $templating, Router $router): ?string
    {
        $locality = Locality::find($localityId);
        if (! $locality) {
            throw new NotFoundException("Missing locality with id $localityId");
        }

        if ($requestLocality) {
            $locality->fill($requestLocality);
            // @todo missing validation
            $locality->save();

            $path = $router->generatePath('locality-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('locality/edit.html.php', [
            'locality' => $locality,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $localityId, Templating $templating, Router $router): ?string
    {
        $locality = Locality::find($localityId);
        if (! $locality) {
            throw new NotFoundException("Missing locality with id $localityId");
        }

        $html = $templating->render('locality/show.html.php', [
            'locality' => $locality,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $localityId, Router $router): ?string
    {
        $locality = Locality::find($localityId);
        if (! $locality) {
            throw new NotFoundException("Missing locality with id $localityId");
        }

        $locality->delete();
        $path = $router->generatePath('locality-index');
        $router->redirect($path);
        return null;
    }
}