function toggleMenuBar() {
    console.log("menu clicked");
    var topNav = document.getElementById("nav-bar");
    if (topNav.className === "topnav") {
        topNav.className += " responsive";
    } else {
        topNav.className = "topnav";
    }
}

function closeMenuBar() {
    console.log("closed clicked");
    var topNav = document.getElementById("nav-bar");
    topNav.className = "topnav";
}