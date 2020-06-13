// Load the Visualization API and the corechart package.
function loadGChartsAPI() {
    google.charts.load('current', {'packages':['corechart']});
    return new Promise((resolve) => {
        google.charts.setOnLoadCallback(resolve);
    });
}