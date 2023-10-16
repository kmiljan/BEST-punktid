<?php


require_once '../host/host.php';
require_once '../util/SQL_session.php';

class Group {
    public function __construct(
        public int $id,
        public string $name
    )
    {
    }

    public function getNameIdentifier(): string {
        return str_replace(' ', '_', $this->name);
    }
}

/**
 * @return array<Group>
 */
function getGroups(): array
{
    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $sql = "SELECT V.valdkond_kood, V.nimetus FROM Valdkond V ORDER BY V.valdkond_kood";

    $query = $conn->prepare($sql);
    $query->execute();
    $result = $query->get_result()->fetch_all();

    return array_map(fn($row) => new Group(intval($row[0]), $row[1]), $result);
}