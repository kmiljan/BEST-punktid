<!DOCTYPE HTML>
<html>
    <?php
        require("templates/head.htm");
    ?>
    <body>
        <?php
            $backButton=false;
            require("templates/header.php");
        ?>
        
        <div id="screenWrapper">
            <div id="screen" class=" _invisCapable"></div>
        </div>
    <?php
        require("templates/footer.htm");
        require("templates/render.htm");
        require("templates/js.htm");
    ?>
    </body>
</html>