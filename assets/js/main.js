var sectionHeight = function() {
    var total    = $(window).height(),
        $section = $('section').css('height','auto');

    if ($section.outerHeight(true) < total) {
        var margin = $section.outerHeight(true) - $section.height();
        $section.height(total - margin - 20);
    } else {
        $section.css('height','auto');
    }
}

$(window).resize(sectionHeight);

$(function() {
    let currentLevel = 2;
    let subMenu = "";
    $("section h2, section h3").each(function(){
        let level = this.nodeName.toLowerCase().substr(1, 1);
        let aTag = "<a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a>"

        console.log("level: " + level + " cl: " + currentLevel);

        if (level === "2") {
            $("nav ul").append("<li class='tag-h" + level + "'>" + aTag + subMenu + "</li>");
            subMenu = "";
        }
        else if (level === "3") {
            subMenu += "<li class='tag-h" + level + "'>" + aTag + "</li>"
        }



        $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
        $("nav ul li:first-child a").parent().addClass("active");

        currentLevel = level;
    });

    $("nav ul li").on("click", "a", function(event) {
        var position = $($(this).attr("href")).offset().top - 190;
        $("html, body").animate({scrollTop: position}, 400);
        $("nav ul li a").parent().removeClass("active");
        $(this).parent().addClass("active");
        event.preventDefault();
    });

    sectionHeight();

    $('img').on('load', sectionHeight);
});