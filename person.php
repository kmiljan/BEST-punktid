<!DOCTYPE HTML>
<html>
    <?php
        require("templates/head.htm");
    ?>
    <body>
        <?php
            $backButton=true;
            require("templates/header.php");
        ?>
        
        <div id="screenWrapper">
            <div id="screen" class=" _invisCapable"></div>
        </div>
    <?php
        
        if(!empty($_GET['name'])) {
            $name= htmlspecialchars($_GET['name']);
        }
        else{
            //redirect
        }
        echo("<script>var page='$name';</script>");
        require("templates/footer.htm");
        require("templates/js.htm");
    ?>
    </body>
</html>