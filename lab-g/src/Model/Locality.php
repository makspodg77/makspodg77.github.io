<?php
namespace App\Model;

use App\Service\Config;
use const http\Client\Curl\Versions\CURL;

class Locality
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $municipality = null;
    private ?string $county = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Locality
    {
        $this->id = $id;

        return  $this;
    }

    public function setName(?string $name)
    {
        $this->name = $name;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setMunicipality(?string $municipality)
    {
        $this->municipality = $municipality;

        return $this;
    }

    public function getMunicipality()
    {
        return $this->municipality;
    }

    public function setCounty(?string $county)
    {
        $this->county = $county;

        return $this;
    }

    public function getCounty()
    {
        return $this->county;
    }

    public static function fromArray($array): Locality
    {
        $locality = new self();
        $locality->fill($array);

        return $locality;
    }

    public function fill($array): Locality
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['municipality'])) {
            $this->setMunicipality($array['municipality']);
        }
        if (isset($array['county'])) {
            $this->setCounty($array['county']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM locality';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $localities = [];
        $localitiesArray = $statement->fetchAll((\PDO::FETCH_ASSOC));
        foreach ($localitiesArray as $localityArray) {
            $localities[] = self::fromArray($localityArray);
        }

        return $localities;
    }

    public static function find($id): ?Locality
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM locality WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $localityArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $localityArray) {
            return null;
        }
        $locality = Locality::fromArray($localityArray);

        return $locality;
    }

    public function save(): void
    {
        $pdo = new \PDO(CONFIG::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO locality (name, municipality, county) VALUES (:name, :municipality, :county)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'municipality' => $this->getMunicipality(),
                'county' => $this->getCounty()
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE locality SET name = :name, municipality = :municipality, county = :county WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':municipality' => $this->getMunicipality(),
                ':county' => $this->getCounty()
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM locality WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setMunicipality(null);
        $this->setCounty(null);
    }
}