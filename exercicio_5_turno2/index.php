<?php

require_once('connection.php');

function generateNumbers($min, $max, $length)
{
    $arrayNumbers = [];

    while (sizeof($arrayNumbers) < $length) {
        $randomNumber = rand($min, $max);
        if (!in_array($randomNumber, $arrayNumbers)) {
            array_push($arrayNumbers, $randomNumber);
        }
    }

    return $arrayNumbers;
}

if (!empty($_POST)) {
    if (isset($_POST['createkey'])) {
        $key = [
            'estrelas' => generateNumbers(1, 5, 2),
            'numeros' => generateNumbers(1, 50, 5)
        ];

        $stmtChave = $pdo->prepare('INSERT INTO `chave` (`id`) VALUES (NULL)')->execute();
        $lastInsertedIdChave = $pdo->lastInsertId();

        foreach ($key['numeros'] as $num){
            $stmtChave = $pdo->prepare(
                "INSERT INTO `numeros` (`numero`, `id_chave`) VALUES (:numero, :idchave)"
            );
            $stmtChave->bindParam(':numero', $num, PDO::PARAM_INT);
            $stmtChave->bindParam(':idchave', $lastInsertedIdChave, PDO::PARAM_INT);
            $stmtChave->execute();
        }

        foreach ($key['estrelas'] as $star){
            $stmtEstrela = $pdo->prepare(
                "INSERT INTO `estrelas` (`numero`, `id_chave`) VALUES (:numero, :idchave)"
            );
            $stmtEstrela->bindParam(':numero', $star, PDO::PARAM_INT);
            $stmtEstrela->bindParam(':idchave', $lastInsertedIdChave, PDO::PARAM_INT);
            $stmtEstrela->execute();
        }

    }

    if (isset($_POST['delete'])) {
        $listKeys = [];

        $pdo->prepare(
            "DELETE FROM chave"
        )->execute();

        $pdo->prepare(
            "DELETE FROM numeros"
        )->execute();

        $pdo->prepare(
            "DELETE FROM estrelas"
        )->execute();

    }
}


$listKeys = [];

$stmt = $pdo->query('SELECT	id	FROM	chave');
foreach ($stmt as $chave)
{
    $idChave = $chave['id'];

    $chave = (object)[
        'estrelas' => $pdo->query('SELECT id, numero FROM estrelas where id_chave = ' . $idChave)->fetchAll(PDO::FETCH_KEY_PAIR),
        'numeros' => $pdo->query('SELECT id, numero FROM numeros where id_chave = ' . $idChave)->fetchAll(PDO::FETCH_KEY_PAIR)
    ];

    array_push($listKeys, $chave);

}

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Euromilhoes</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"/>
</head>
<body>

<section class="menu">
    <div class="menu-container">
        <h1>Euro Milhões</h1>

        <table>
            <thead>
            <tr>
                <td>Chave</td>
                <td>Chave ordenada</td>
                <td>Estrelas</td>
            </tr>
            </thead>
            <tbody>
            <?php
                foreach ($listKeys as $key) {
                    asort($key->numeros);
                    asort($key->estrelas);
                    echo '
                        <tr>
                            <td>' . implode(", ", $key->numeros) . ' => ' . implode(", ", $key->estrelas) . '</td>
                            <td>' . implode(", ", $key->numeros) . '</td>
                            <td>' . implode(", ", $key->estrelas) . '</td>
                        </tr>
                    ';
                }
            ?>

            </tbody>
        </table>

        <br>
        <form method="POST">
            <button name="createkey" value="1">Gerar Chave</button>
            <button name="delete" value="1"> Limpar Chave</button>
        </form>
    </div>
</section>

</body>

</html>

