<!DOCTYPE HTML>
<html>
    <?php
        require("../templates/head.htm");
    ?>
    <body>
        <?php
            $backButton=true;
            require("../templates/header.php");
        ?>
        <div id="screenWrapper">
            <div class="basicScreen" class=" _invisCapable">
                <h1>Midagi on valesti (või hästi?)</h1>
                <p>
                    Siin saad sellest teada anda.
                </p>
                <p>
                    Kui tahad näidata mõnda tarkvaraviga, siis pane lingina kaasa ka pilt ning seleta, kuidas probleemini jõudsid. See lihtsustab oluliselt probleemi lahendamist.
                </p>
                <div class="feedback">
                    <form name="contactform" method="post" action="/saadetud">
                        <label for="name">Nimi</label>
                        <input autocomplete="off"  name="name" maxlength="60" size="30">
                        <label for="content">Sisu</label>
                        <textarea name="content"></textarea>
                        <input type="submit" value="saada">
                    </form>
                </div>
            </div>
        </div>

        <?php
            require("../templates/footer.htm");
        ?>
    </body>
</html>