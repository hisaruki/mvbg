(function () {
    var resize = function () {
        $("#sub img").css("height", $(window).height() + "px");
        var mw = $(window).width() - $("#sub img").width();
        mw = Math.ceil(mw);
        $("#main img").width(mw);
    }

    $(window).on("resize load", function () {
        resize();
    });

    var speed = 10;
    var slideshow = -1;
    var go = 1;
    var moving = null;
    var move = function () {
        if (moving) {
            clearInterval(moving);
        }
        moving = setInterval(function () {
            if (slideshow > 0) {
                x = $("#main").css("top");
                x = x.replace("px", "") - 0

                if (x > 0) {
                    x = $("#main img").height() * -1 + $(window).height();
                    x = Math.ceil(x);
                }
                if (x < ($("#main img").height() - $(window).height()) * -1) {
                    x = 0;
                }

                $("#main").css("top", x - go);
            }
        }, speed);
    }
    move();

    var change_speed = function(mode){
        if(mode == "button"){
            speed = speed / 2;
            if (speed > 1) {
                speed = Math.ceil(speed);
            } else {
                speed = 40;
            }
        }else{
            if(mode > 0){
                speed = Math.ceil(speed / 2);
            }else{
                speed = Math.ceil(speed * 2);
                if(speed > 40){
                    speed = 40;
                }
            }
        }
        $("#speed var").text(Math.ceil(speed));
        $("#speed span").text("x" + (10 / speed));
        move();
    }

    var c = null;
    $("#main img, #sub img").on("dblclick", function () {
        $("#edit").attr("data-editing", $(this).parent().attr("id"));
        var im = $('#edit img')
        im.attr("src", $(this).attr("src"));
        $("#edit").show();
        c = im.cropper({
            "toggleDragModeOnDblclick": true,
            "viewMode": 1,
            "autoCropArea": 0.95
        });
    });


    $("button").on("click", function () {
        var method = $(this).attr("data-method")

        if (method == "destroy") {
            c.cropper('destroy');
            $("#edit").hide();
        }

        if (method == "submit") {
            var src = c.cropper('getCroppedCanvas').toDataURL('image/png');
            var target = $("#edit").attr("data-editing");
            $('img', '#' + target).attr("src", src);
            c.cropper('destroy');
            $("#edit").hide();
            resize();
        }

        if (method == "rotate") {
            c.cropper(
                'rotate',
                $(this).attr("data-option")
            );
        }

        if (method == "copy") {
            var option = $(this).attr("data-option");
            if (option == "l2r") {
                $("#sub img").attr("src", $("#main img").attr("src"));
            } else {
                $("#main img").attr("src", $("#sub img").attr("src"));
            }
            resize();
        }


        if (method == "speed") {
            change_speed("button");
        }
        if (method == "save") {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob(['<html>' + $("html").html() + "</html>"]));
            link.download = filename + ".html";
            link.click();
        }
    });

    $(document).on("keypress", function (e) {
        //q
        if (e.which == 113) {
            $('button[data-method="destroy"]').click();
        }

        //space
        if (e.which == 32) {
            slideshow = slideshow * -1;
        }
        //r
        if (e.which == 114) {
            go = go * -1;
        }
        //num
        if (49 <= e.which && e.which <= 57) {
        }
        //plus
        if (e.which == 43) {
            change_speed(1);
        }
        //substruct
        if (e.which == 45) {
            change_speed(-1);
        }
        //j
        if (e.which == 106) {
            $("#main").css("top", 0);
        }
        //k
        if (e.which == 107) {
            $("#main").css("top", ($("#main img").height() - $(window).height()) * -1);
        }
        //h
        if (e.which == 104) {
        }
        //l
        if (e.which == 108) {
        }


    });

})();