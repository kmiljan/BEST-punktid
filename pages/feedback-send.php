
<?php
$promptHeading="See läks sassi";
$prompt="Ma isegi ei tea, miks. Nüüd sa pead vanamoodselt sellest teada anda, mida sa öelda tahtsid.";

if(isset($_POST['name'])) {
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
}
else {
    $name="määramata";
}
if(isset($_POST['content'])) {
    $message = htmlspecialchars(stripslashes(trim($_POST['content'])));
}
else {
    $message="";
}



if(empty($message)) {
    $prompt="Ei, tühju tagasisidesid me küll edasi ei saada.";
}
else {
    $to = 'phpmailfunctest@gmail.com'; // edit here
    $body = "Nimi: $name\nSisu: $message";

    if(mail($to, "BEST IT-Süsteem: Punktisüsteemi tagasiside", $body)){
        $prompt="See, mille sa hoolega lahtritesse kirja panid, on nüüd vastavatesse sihtkohtadesse saadetud.";
        $promptHeading="Saadetud";
    }
    else {
        $prompt="Ma isegi ei tea, miks. Nüüd sa pead vanamoodselt sellest teada anda, mida sa öelda tahtsid.";
        $promptHeading="See läks sassi";
    }
}
  ?>
<!DOCTYPE HTML>
<html>
    <?php
        require("../templates/head.htm");
    ?>
    <body>
        <?php
            require("../templates/header.htm");
        ?>
        <div id="screenWrapper">
            <div class="basicScreen" class=" _invisCapable">
                <h1><?php echo $promptHeading?></h1>
                <p>
                <?php echo $prompt?>
                </p>
            </div>
        </div>

        <?php
            require("../templates/footer.htm");
        ?>
    </body>
</html>