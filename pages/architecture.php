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
                <h1>Kuidas see kõik töötab?</h1>
                <h2>Modernsemad ajad toovad paremad lahendused:</h2>
                <p>Nüüdseks on punktisüsteem ja liikmehaldus viidud ühisesse andmebaasi, mistõttu on liikmete punktide pärimine selle võrra ka lihtsam.</p>
                <h3>Front-end</h3>
                <p>Veebileht on JavaScript rakendus, mis muuhulgas koostab standardseid tabeleid ja graafikuid, ning paneb need ekraanil ruudustikule.</p>
                <p>Iga graafik või tabel on jagatud sisemiselt kaheks: <em>display</em> ja <em>render</em> osa. <em>Display</em> on kindla kasutuse, ülesande ning andmeallikaga objekt. Näited on selle kuu parimate tabel või spetsiifiliselt bestika kogupunktide numbri element. Iga <em>display</em> küsib ise andmed ning laseb sobival <em>render</em> objektil teha saadud andmete põhjal graafik, tabel või muu näidik. <em>Render</em> objektid ongi näidikud, tabelid või graafikud, nagu näiteks joongraafik või punkte näitav element.</p>
                <p>Andmed küsib <em>display</em> element sobiva GET päringuga, millele vastuseks saab genereeritud JSON formaadis andmed.</p>
                <h3>Back-end</h3>
                <p>Andmed tabelitesse ja graafikutesse päritakse backend rakendusest, mis omakorda teeb SQL päringud andmebaasi. Hetkel (as of 23.10.2023) ei ole päringute vahele pandud mingisugust cahce süsteemi, et kiirendada samade andmete päringute kiirust ning vähendada andmebaasi koormust.</p>
                <p>Kõik nähtav statistika arvutatakse backendis ning edastatakse frontendi graafikutele kasutamiseks.</p>
                <h2>Vanasti, kui muru oli rohelisem ja taevas sinisem, oli see nii:</h2>
                <p><strong>Alates 21.10.2023 on rakendus viidud üle kasutama uut BEST-Estonia siseveebi andmebaasi.</strong></p>
                <h3>Punktid sisestati Google Sheetsis</h3>
                <p>Koordinaatorid täidavad Google Spreadsheets lehti, mis kogutakse iga 5 minuti tagant kokku, salvestatakse BESTi SQL andmebaasi, ning arvutatakse salvestatud andmetelt mõngingat statistikat.</p>
                <p>Iga kord, kui keegi laeb punktide vaatamiseks lehe, küsib leht backend süsteemilt andmeid, mis omakorda küsib need andmebaasist ning teeb ka ise vajadusel mõned arvutused.</p>
                <h3>Koordinaatorite tabelid</h3>
                <p>Iga töögrupi koordinaatoril on oma tabel, kuhu lähevad sissekanded igast korrast, kui mõni bestikas midagi punktiväärilist korda saatis. Seal tabelis on igal sissekandel nimi, punkte andev tegevus, kuupäev millal tegevus tehti, ning palju ta seda ja selle eest punkte sai.</p>
                <p>Neid andmeid kogutakse igal 5 minutil. Andmed laetakse nendest siiski uuesti vaid siis, kui seda tabelit võrreldes eelmise korraga muudetud on</p>
                <h3>Andmete laadimine</h3>
                <p>BESTi veebiserveris on üles seatud CRON töö, mis iga viie minuti tagant proovib uuendada koordinaatorite tabelist andmeid.</p>
                <p>Esialgu küsitakse läbi Drive API viimase muudatuse kellaaega ja kuupäeva. Kui viimane muudatus on tehtud peale viimase uuenduse aega (salvestatud state/state.json failis), siis viiakse selle tabeli jaoks läbi täielik andmete lugemine.</p>
                <p>Andmed loetakse läbi Spreadsheets API, ning väikeste muudatuste ning korrektsioonidega saadetakse need kohe, rida-rida haaval, MySQL andmebaasi.</p>
                <h3>Meta-andmete arvutamine</h3>
                <p>Arvestades, et iga kord kui keegi oma punkte näha tahab, peab saadaval olema mingil määral pika protsessi tulemusel loodud statistikat, siis eel-arvutatakse see statistika andmete laadimise järel.</p>
                <p>Luuakse eelarvutatud andmed:<br>iga töögrupi järgi iga inimese koondpunktid,<br>iga inimese enda koondpunktid,<br>töögruppides kokku saadud punktid,<br>bestikate nimed, kellel üldse punkte on.</p>
                <p>Nii on igaks nõudmiseks suur osa andmeid juba vaid mõne andmebaasipäringu kaugusel. Sellega on andmete uuendamine lõppenud</p>
                <h3>Front-end</h3>
                <p>Veebileht on JavaScript rakendus, mis muuhulgas koostab standardseid tabeleid ja graafikuid, ning paneb need ekraanil ruudustikule.</p>
                <p>Iga graafik või tabel on jagatud sisemiselt kaheks: <em>display</em> ja <em>render</em> osa. <em>Display</em> on kindla kasutuse, ülesande ning andmeallikaga objekt. Näited on selle kuu parimate tabel või spetsiifiliselt bestika kogupunktide numbri element. Iga <em>display</em> küsib ise andmed ning laseb sobival <em>render</em> objektil teha saadud andmete põhjal graafik, tabel või muu näidik. <em>Render</em> objektid ongi näidikud, tabelid või graafikud, nagu näiteks joongraafik või punkte näitav element.</p>
                <p>Andmed küsib <em>display</em> element sobiva GET päringuga, millele vastuseks saab genereeritud JSON formaadis andmed.</p>
            </div>
        </div>

    <?php
        require("../templates/footer.htm");
    ?>
    </body>
</html>