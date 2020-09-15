(function () {
    var resize = function () {
        $("#sub img").css("height", $(window).height() + "px");
        var mw = $(window).width() - $("#sub")[0].offsetWidth;
        mw = Math.ceil(mw);
        $("#main img").width(mw);
    }

    $(window).on("resize load", function () {
        resize();
    });
    $("title").text(filename);

    var speed = 1;
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

                var imgHeight = $("#main")[0].scrollHeight;

                if (x > 0) {
                    x = imgHeight * -1 + $(window).height();
                    x = Math.ceil(x);
                }
                if (x < (imgHeight - $(window).height()) * -1) {
                    x = 0;
                }

                $("#main").css("top", x - go);
            }
        }, speed);
    }
    move();

    var change_speed = function (mode) {
        if (mode == "button") {
            speed = speed / 2;
            if (speed > 1) {
                speed = Math.ceil(speed);
            } else {
                speed = 40;
            }
        } else {
            if (mode > 0) {
                speed = Math.ceil(speed / 2);
            } else {
                speed = Math.ceil(speed * 2);
                if (speed > 40) {
                    speed = 40;
                }
            }
        }
        $("#speed var").text(Math.ceil(speed));
        $("#speed span").text("x" + (10 / speed));
        move();
    }

    var c = null;
    $("button.toggle").on("click", function () {
        $(this).toggleClass("active");
    });

    var mkedit = function(img){
        img.on("dblclick", function () {
            $("#edit").attr("data-editing", $(this).parent().attr("id"));
            var im = $('#edit img')
            im.attr("src", $(this).attr("src"));
            $("#edit").show();
            var aspectRatio = null;
            if (!$("[data-method=aspectratio]").hasClass("active")) {
                aspectRatio = $("#main").width() / $(window).height();
            }
            c = im.cropper({
                "aspectRatio": aspectRatio,
                "toggleDragModeOnDblclick": true,
                "viewMode": 1,
                "autoCropArea": 0.95
            });
        }).on("mouseup", function (e) {
            if (e.which == 2) {
                $(this).remove();
            }
        });
        return img;
    }

    var mkpallete = function (ib) {
        ib.on("mouseup", function (e) {
            if (e.which == 2) {
                $(this).remove();
            } else {
                var target = '#main';
                if (e.which == 3) {
                    target = '#sub';
                }
                var src = $(this).find("img").attr("src");
                var img = $('<img>');
                img.attr("src", src);
                if (!e.ctrlKey) {
                    $(target).empty();
                }
                img = mkedit(img);
                $(target).append(img);
            }
            resize();
        }).on("contextmenu", function () {
            return false;
        }).on("dblclick", function(){
            var src = $(this).find("img").attr("src");
            $("body").css("background-image", 'url("'+ src + '")');
        });
        return ib;
    }

    if ($("nav img").length > 0) {
        images = Array();
        $("nav img").each(function () {
            images.push($(this).attr("src"));
        });
        $("nav img").parent("button").remove();
    } else {
        images.forEach(function(image){
            var img = $('<img>');
            img.attr("src", image);
            $("#main").append(img);
            img = mkedit(img);
            var img = $('<img>');
            img.attr("src", image);
            img = mkedit(img);
            $("#sub").append(img);
        });
    }

    for (i = 0; i < images.length; i++) {
        var src = images[i];
        var ib = $('<button><img src=' + src + '></button>');
        ib = mkpallete(ib);
        $("nav").append(ib);
    }


    var moveTo = function (i, target) {
        if ($("#main img").length - 1 >= i) {
            var y = 0;
            var j = 0;
            $("#main img").each(function(){
                if(j < i){
                    y += $(this).height();
                }
                j++;
            });
            if(!target){
                y += $("#main img").eq(i).height();
                y -= $(window).height();
            }
            y *= -1;
            console.log(i, target, y);
            $("#main").css("top", y);
        }

    }

    FileList.prototype.map = Array.prototype.map
    let uploader = $('<input id="upload" type="file" multiple="multiple">').hide().on("change", function(){
        this.files.map(function(file){
            let reader = new FileReader();
            reader.onload = function () {
                var ib = $('<button><img src=' + reader.result + '></button>');
                ib = mkpallete(ib);
                $("nav").append(ib);
            }
            reader.readAsDataURL(file);

        });
    });
    let b = $("<label>").attr("for", "upload").html("file").append(uploader);
    $("nav").prepend(b);


    $("button").on("click", function () {
        var method = $(this).attr("data-method")

        if (method == "destroy") {
            c.cropper('destroy');
            $("#edit").hide();
        }

        if (method == "submit") {
            var src = c.cropper('getCroppedCanvas').toDataURL('image/png');
            //var target = $("#edit").attr("data-editing");
            //$('img', '#' + target).attr("src", src);
            var ib = $('<button><img src=' + src + '></button>');
            ib = mkpallete(ib);
            $("nav").append(ib);
            c.cropper('destroy');
            $("#edit").hide();
        }

        if (method == "rotate") {
            c.cropper(
                'rotate',
                $(this).attr("data-option")
            );
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
        resize();
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
        }
        //k
        if (e.which == 107) {
        }
        //h
        if (e.which == 104) {
            $("#main").css("top", 0);
        }
        //l
        if (e.which == 108) {
            var i = $("#main img").length - 1;
            moveTo(i, false);
        }

        //1-9
        if (49 <= e.which && e.which <= 57) {
            var i = e.which - 49;
            moveTo(i, true);
        }



    });
    resize();

})();