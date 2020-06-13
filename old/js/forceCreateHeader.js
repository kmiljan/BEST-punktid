function navigateToURL(URL) {
    window.location.href = URL;
}
function navigateToHomepage() {
    navigateToURL('/');
}
render.header.create(document.getElementById("header"), navigateToHomepage, undefined);
render.header.showBackbutton();