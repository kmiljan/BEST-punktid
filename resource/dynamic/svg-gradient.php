<?php
    
    require("../../util/global.php");
    header('Content-type: image/svg+xml');
    if(!empty($_GET["group"])) {
        $groupIdentifier=($_GET["group"]);
    }
    else {die();}
    
    
?>
<svg width="42.333mm" height="42.333mm" version="1.1" viewBox="0 0 42.333 42.333" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <defs>
  <linearGradient id="linearGradient1251" x1="2413" x2="2619.4" y1="40.354" y2="37.708" gradientTransform="matrix(.20513 0 0 16 -494.97 -348.67)" gradientUnits="userSpaceOnUse">
   <stop style="stop-color:<?php echo($dataTables[$groupIdentifier]->colors[0]);?>" offset="0"/>
   <stop style="stop-color:<?php echo($dataTables[$groupIdentifier]->colors[1]);?>" offset="1"/>
  </linearGradient>
 </defs>
 <g transform="translate(0 -254.67)">
  <rect y="254.67" width="42.333" height="42.333" style="fill:url(#linearGradient1251);paint-order:markers fill stroke"/>
 </g>
</svg>


