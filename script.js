(function () {
    var mi = $('<img>');
    mi.attr("src", src);
    $("#main").append(mi);
    var mi = $('<img>');
    mi.attr("src", src);
    $("#sub").append(mi);

    var resize = function () {
        var w = $(window).width() - $("#sub img").width();
        w = Math.ceil(w);
        $("#main img").css("width", w + "px");
    }

    $(window).on("resize load", function () {
        resize();
    });

    var c = null;

    $("#main img, #sub img").on("click", function () {
        $("#edit").attr("data-editing", $(this).parent().attr("id"));
        var im = $('#edit img')
        im.attr("src", $(this).attr("src"));
        $("#edit").show();
        c = im.cropper({
        });
    });

    $("#cancel").on("click", function () {
        $('#edit img').cropper('destroy');
        $("#edit").hide();
    });

    $("#ok").on("click", function () {
        var src = c.cropper('getCroppedCanvas').toDataURL('image/jpeg');
        var target = $("#edit").attr("data-editing");
        $('img','#'+target).attr("src", src);
        $('#edit img').cropper('destroy');
        $("#edit").hide();
        resize();
    });

})();