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
    let parentId;

    $("section h2, section h3").each(function(){
        let level = this.nodeName.toLowerCase().substr(1, 1);
        let id = $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'');
        let aTag = "<a href='#" + id + "'>" + $(this).text() + "</a>"

        if (level === "2") {
            parentId = id;
        }
        let level3Content = "";
        if (level === "3") {
            level3Content = " parent-id='" + parentId + "' style='display: none' "
        }

        let liTag = "<li class='tag-h" + level + "' menu-id='" + id + "'" + level3Content + ">" + aTag + "</li>";

        if (currentLevel === level) {
            menu += liTag;
        }
        else if (level > currentLevel) {
            menu = menu.substr(0, menu.length - 5)
            menu += "<ul>" + liTag;
        }
        else if (level < currentLevel) {
            menu += "</ul></li>" + liTag;
        }

        currentLevel = level;

        $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    });

    $("nav ul").append(menu);
    $("nav ul li:first-child a").parent().addClass("active");

    $("nav ul li").on("click", "a", function(event) {
        var position = $($(this).attr("href")).offset().top - 190;
        $("html, body").animate({scrollTop: position}, 400);
        $("nav ul li a").parent().removeClass("active");
        let parent = $(this).parent();

        parent.hasClass()
        parent.addClass("active");
        let menuId = parent.attr("menu-Id");
        if (parent.hasClass("tag-h2")) {
            $('li[parent-id]').hide();
            $('li[parent-id="' + menuId + '"]').show();
        }
        event.preventDefault();
    });

    sectionHeight();

    $('img').on('load', sectionHeight);
});