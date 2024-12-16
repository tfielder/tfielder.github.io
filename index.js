$(document).ready(function() {
        MainTheme = (function() {
            function MainTheme(args) {
                this.el = $(args.el);
                this.audio = this.el.find("audio").get(0);
                this.start = this.el.find("#start");
                this.animation = this.el.find("#animation");
                //remove animation
                this.reset();
        
                this.start.bind("click", $.proxy(function() {
                    this.start.hide();
                    this.audio.play();
                    this.el.append(this.animation);
                }, this));
        
                $(this.audio).bind('ended', $.proxy(function() {
                    this.audio.currentTime = 0;
                    this.reset();
                }, this));
            }
        
            // resets animation
            MainTheme.prototype.reset = function() {
                this.start.show();
                this.cloned = this.animation.clone(true);
                this.animation.remove();
                this.animation = this.cloned;
            };
            
            return MainTheme;
        })();
        
        const intro = new MainTheme({
            el: "#hero-section"
        });
    }
);

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