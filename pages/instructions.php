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
                <h1>Kasutusjuhend</h1>
                <h2>Pealeht</h2>
                <p>Siin näed üldstatistikat kõigi bestikate kohta. Samuti saad nime sisestades minna üle individuaalsele vaatele.</p>
                <p>Siiski on selle kuu andmete tabelitel üks nüanss: arvesse ei lähe juhatuse liikmed. Kõigil, keda ei arvestata kuu edetabelites, on nende isiklike punktide lehel ka vastav teade.</p>
                <h2>Individuaalne statistika</h2>
                <p>Siin näed bestika individuaalselt kogutud punkte nii terve tema tegevusaja kui ka käesoleva kuu ning õppeaasta jooksul. Õppeaasta algab punktisüsteemi jaoks augustiga.</p>
                <p>Samuti näed seda, kuidas punktid töögruppide vahel ära jaotatud on. Iga töögrupi ja üldjaotise kohta on ka täielik tegevuste tabel, kus on näha iga tegevuse tüüp, mille eest punkte saadud on.</p>
                <p>Kui lehe lõppu vaadata, ilmub nähtavale ka kogu tegevusaja aktiivsuse graafik. Siit saab näha ühe kuu täpsusega nii tegevuste kui ka punktide arvu.</p>
            </div>
        </div>
            
        <?php
            require("../templates/footer.htm");
        ?>
    </body>
</html>