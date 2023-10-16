<?php
    
    require("../../util/global.php");
    require_once '../../config/groups.php';
    global $groupProperties;

    header('Content-type: image/svg+xml');
    if(!empty($_GET["group"])) {
        $groupIdentifier=($_GET["group"]);
    }
    else {die();}
    
    
?>
<svg width="42.333mm" height="42.333mm" version="1.1" viewBox="0 0 42.333 42.333" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <defs>
  <linearGradient id="linearGradient6325" x2="42.333" y1="297" y2="254.67" gradientUnits="userSpaceOnUse">
   <stop style="stop-color:<?php echo($groupProperties[$groupIdentifier]['colors'][0]);?>" offset="0"/>
   <stop style="stop-color:<?php echo($groupProperties[$groupIdentifier]['colors'][1]);?>" offset=".5"/>
   <stop style="stop-color:<?php echo($groupProperties[$groupIdentifier]['colors'][0]);?>" offset="1"/>
  </linearGradient>
 </defs>
 <g transform="translate(0 -254.67)">
  <path d="m0 254.67h42.333v42.333h-42.333z" style="fill:url(#linearGradient6325);paint-order:markers fill stroke"/>
 </g>
</svg>



