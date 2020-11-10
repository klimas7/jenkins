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
    let menu = "";
    let currentLevel = "2";
    $("section h2, section h3").each(function(){
        let level = this.nodeName.toLowerCase().substr(1, 1);
        let aTag = "<a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a>"
        let liTag = "<li class='tag-h" + level + "'>" + aTag + "</li>";

        if (currentLevel === level) {
            menu += liTag;
        }
        else if (level > currentLevel) {
            menu = menu.substr(0, menu.length - 5)
            menu += "<ul>" + liTag;
        }
        else if (level < currentLevel) {
            menu += liTag + "</ul>"
            menu += "</li>"
        }

        currentLevel = level;
        // if (level === "2") {
        //     if (subMenu.length > 0) {
        //         subMenu += "</ul>"
        //     }
        //     $("nav ul").append("<li class='tag-h" + level + "'>" + aTag + subMenu + "</li>");
        //     subMenu = "";
        // }
        // else if (level === "3") {
        //     if (subMenu.length === 0) {
        //         subMenu += "<ul>"
        //     }
        //     subMenu +=
        // }



        $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    });

    $("nav ul").append(menu);
    $("nav ul li:first-child a").parent().addClass("active");

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