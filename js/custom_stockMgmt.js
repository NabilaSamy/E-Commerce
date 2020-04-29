var eCommerceAPI = "http://webdev.exabyte-eg.com/APIs/eCommerce"; // const for API

// add parameters to URL API
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

// to know which HTML page I work inside JS
$.urLPage = function () {
    return (window.location.href).split('/').pop();
}

// remove parmeter from URL API
function urlParamRemove(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    var newHref = window.location.href;
    if (results) {
        if (results[0][0] == '?') {
            var totalIndex = results['index'] + results[0].length;
            if (results['input'].charAt(totalIndex) == '&') newHref = newHref.replace(results[0] + '&', '?');
            else if (results['input'].charAt(totalIndex) == '') newHref = newHref.replace(results[0], '');
            else newHref = newHref.replace(results[0], '');
        } else if (results[0][0] == '&') newHref = newHref.replace(results[0], '');

        window.location.replace(newHref);
    }
}

// set cookie in whole website
function setCookie(cname, cvalue, exdays) {
    if (exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else document.cookie = cname + "=" + cvalue + ";path=/";
}

// get cookie in whole website
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* ================================================================================================== */

(function () {
    var html = document.querySelector('html');
    var file = html.getAttribute('json-loc');
    var supportedLanguages = ['en', 'ar'];
    var cLang;

    function checkLang() {
        if (!getCookie('lang')) {
            var userLang = window.navigator.userLanguage || window.navigator.language;
            for (var i = 0; i < supportedLanguages.length; i++) {
                if (userLang.toLowerCase().indexOf(supportedLanguages[i]) >= 0) setCookie('lang', userLang);
                else setCookie('lang', 'en');
            }
        }
        cLang = (getCookie('lang') ? getCookie('lang') : 'en');
    }

    function implementJson() {
        $.getJSON(file, function (data) {
                /* for (var i = 0; i < supportedLanguages.length; i++) {
                     var lang = supportedLanguages[i];
                     if (cLang !== lang) {
                         $('[langChangerDropdown]').append('<a class="nav-link" href="?lang=' + data['lang'][lang] + '">' + data['lang'][lang + "-text"] + '</a>');
                     }
                 }*/

                var lang = data['lang'];
                var dir = data['dir'];

                html.setAttribute("lang", lang[cLang]);
                html.setAttribute("dir", dir[cLang]);

                if ($("[json-html]")) {
                    $("[json-html]").each(function (i, e) {
                        var json = $(e).attr("json-html");
                        if (data[json][cLang]) {
                            $(e).html(data[json][cLang]);
                            $(e).removeAttr("json-html");
                        }
                    });
                }
                if ($("[json-class]")) {
                    $("[json-class]").each(function (i, e) {
                        var json = $(e).attr("json-class");
                        if (data[json][cLang]) {
                            $(e).addClass(data[json][cLang]);
                            $(e).removeAttr("json-class");
                        }
                    });
                }
                if ($("[json-attr]")) {
                    $("[json-attr]").each(function (i, e) {
                        var json = $(e).attr("json-attr").split(',');
                        if (data[json[1]][cLang]) {
                            $(e).attr(json[0], data[json[1]][cLang]);
                            $(e).removeAttr("json-attr");
                        }
                    });
                }


            })
            .fail(function () {
                console.log('error', file);
            });

    };

    function changeLang() {
        if ($.urlParam('lang')) {
            var newLang = $.urlParam('lang');
            setCookie("lang", newLang);
            urlParamRemove('lang');
        }
    }

    window.addEventListener('hashchange', changeLang);

    changeLang()
    checkLang();
    implementJson();
})();

/* ================================================================================================== */
// open sidemenu
function openSide() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

// close sidemenu
function closeSide() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

// count textarea words
$(function () {
    'use strict';
    var maxTest = $('textarea').attr('maxlength');
    $('.message').html('<span></span>Warning! " <span>' + maxTest + '</span> " Words Remaining.');
    $('textarea').keyup(function () {
        var textLength = $(this).val().length,
            remWord = maxTest - textLength;
        $('.message').html('<span></span>Warning! " <span>' + remWord + '</span> " Words Remaining.');
    });
});

/* ================================================================================================== */

document.addEventListener('change', function (event) {
    var ee = event.target;
    if (!ee.matches('[checkValue]')) return;
    else checkValue(ee);
});

function checkValue(ee) {
    if (!ee.value) return;
    var eeValue = ee.value;
    var varType = ee.getAttribute('checkValue');
}

function appendBrandOptions() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/brands"
    }).done(function (data) {
        var output = "";
        for (var i in data["brands"]) output += '<option value="' + data["brands"][i]["id"] + '">' + data["brands"][i]["en"] + " - " + data["brands"][i]["ar"] + '</option>' + "\n";
        $('[appendBrandOptions]').each(function (i, e) {
            $(e).empty();
            $(e).append(output);
        });
    });
}
appendBrandOptions();

function appendCatOptions() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories"
    }).done(function (data) {
        var output = "";
        for (var i in data["cats"]) output += '<option value="' + data["cats"][i]["id"] + '">' + data["cats"][i]["en"] + " - " + data["cats"][i]["ar"] + '</option>' + "\n";
        $('[appendCatOptions]').each(function (i, e) {
            $(e).empty();
            $(e).append(output);
        });
    });
}
appendCatOptions();

function appendTagOptions() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/tags"
    }).done(function (data) {
        var output = "";
        for (var i in data["tags"]) output += '<option value="' + data["tags"][i]["id"] + '">' + data["tags"][i]["en"] + " - " + data["tags"][i]["ar"] + '</option>' + "\n";
        $('[appendTagOptions]').each(function (i, e) {
            $(e).empty();
            $(e).append(output);
        });
    });
}
appendTagOptions();

/* ================================================================================================== */

// Deals with Brand
//output brands
function getBrands() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/brands"
    }).done(function (data) {
        $("#outputBrands").empty();
        var output = "";

        for (var i in data["brands"]) {
            var parentOutput = "";
            for (var j in data["brands"]) {
                if (data["brands"][j]["id"] === data["brands"][i]["parent_id"]) {
                    parentOutput += '<option value="' + data["brands"][j]["id"] + '" selected>' + data["brands"][j]["en"] + " - " + data["brands"][j]["ar"] + "</option>";
                } else {
                    parentOutput += '<option value="' + data["brands"][j]["id"] + '">' + data["brands"][j]["en"] + " - " + data["brands"][j]["ar"] + "</option>";
                }
            }
        }
        output +=
            '<div class="row m-0"><form class="col p-0" cat-form="' + data["brands"][i]["id"] + '"></div><div class="col p-1 form-group"><select class="form-control"> <option value="0">none</option>' + parentOutput + '</select>' + "</div></div>" + "</form></div>" + "\n";
        $("#outputBrands").append(output);
    });
}
getBrands();

/* ---------------------------------------------------------------------------------- */

// Deals with Category
var catData;

//output categories
function getCategories() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories"
    }).done(function (data) {
        $("#cat_display").empty();
        var output = "";
        catData = data;
        for (var i in data["cats"]) {
            var parentOutput = "";
            for (var j in data["cats"]) {
                if (data["cats"][j]["id"] === data["cats"][i]["parent_id"]) {
                    parentOutput += '<option value="' + data["cats"][j]["id"] + '" selected>' + data["cats"][j]["en"] + " - " + data["cats"][j]["ar"] + "</option>";
                } else {
                    parentOutput += '<option value="' + data["cats"][j]["id"] + '">' + data["cats"][j]["en"] + " - " + data["cats"][j]["ar"] + "</option>";
                }
            }
        }
        output +=
            '<div class="row m-0"><form class="col p-0" cat-form="' + data["cats"][i]["id"] + '"></div><div class="col p-1 form-group"><select class="form-control" style="width: 177%; position: relative; bottom: 13px;"> <option value="0">none</option>' + parentOutput + '</select>' + "</div></div>" + "</form></div>" + "\n";
        $("#cat_display").append(output);
    });
}
getCategories();

/* ================================================================================================== */

// Dealing with Tabs
$(".addDB .tab-switch li").click(function () {
    "use strict";
    // Add Selected Class to active link
    $(this).addClass("selected").siblings().removeClass("selected");
    // Hide All Divs
    $(".addDB .tabs-content .tab-content-1, .addDB .tabs-content .tab-content-2, .addDB .tabs-content .tab-content-3").hide();
    // Show All Divs connected with this link
    $("." + $(this).data("class")).show();
});

$(document).on("click", "[tab-controller]", function () {
    var target = $(this).attr("tab-controller");
    $("[tab-controller]").each((i, e) => $(e).removeClass("active"));
    $(this).addClass("active");
    $("[tab]").each((i, e) => $(e).addClass("hidden"));
    $(target).removeClass("hidden");
});
/* ===================================================================================================== */

// get stock
function getStock(offsit, limit) {
    var xhr = new XMLHttpRequest();
    xhr.open(
        'GET',
        "http://webdev.exabyte-eg.com/APIs/eCommerce/maintenance/stock/"
    );

    //track progress

    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status != 200) console.log("error getting data");
    };

    xhr.send();

    xhr.onload = function () {
        appendStock(xhr.response);
    };
}

// retrive stock data form DB
function appendStock(arr) {
    var output = document.getElementById('stock');
    arr = JSON.parse(arr);
    for (var item of arr) {
        var itemTit = item["title"];
        var itemCat = item["category_id"];
        var itemBran = item["brand_id"];
        var itemQStock = item["stock"];
        var itemDescripe = item["desc"];
        console.log("Title: " + itemTit + ", Category:" + itemCat + ", Brand: " + itemBran + ", Item in Stock: " + itemQStock + ", Item Description: " + itemDescripe);
    }
}

/* ===================================================================================================== */

// <input type="number"> must be numbers only
function onlyNumberKey(evt) {
    // Only ASCII charactar in that range allowed 
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) // from 48 to 57 in numbers from 0 to 9
        return false;
    return true;
}

// save product
function saveProdc() {
    var name_en = document.forms["addProductForm"]["name_en"].value;
    var name_ar = document.forms["addProductForm"]["name_ar"].value;
    var brand_id = document.forms["addProductForm"]["brand_id"].value;
    var category_id = document.forms["addProductForm"]["category_id"].value;
    var tag_id = document.forms["addProductForm"]["tag_id"].value;
    var label_en = document.forms["addProductForm"]["label_en"].value;
    var label_ar = document.forms["addProductForm"]["label_ar"].value;
    var title_en = document.forms["addProductForm"]["title_en"].value;
    var title_ar = document.forms["addProductForm"]["title_ar"].value;
    var sku = document.forms["addProductForm"]["sku"].value;
    var stock = document.forms["addProductForm"]["stock"].value;
    var unit_price = document.forms["addProductForm"]["unit_price"].value;
    var discount = document.forms["addProductForm"]["discount"].value;
    var overview_en = document.forms["addProductForm"]["overview_en"].value;
    var overview_ar = document.forms["addProductForm"]["overview_ar"].value;
    var description_en = document.forms["addProductForm"]["description_en"].value;
    var description_ar = document.forms["addProductForm"]["description_ar"].value;
    var thumbnail = document.forms["addProductForm"]["thumbnail"].value;
    var stock_detail_images = document.forms["addProductForm"]["stock_detail_images"].value;

    if (name_en != "" && name_ar != "" && brand_id != "" && category_id != "" && tag_id != "" && label_en != "" && label_ar != "" && title_en != "" && title_ar != "" && sku != "" && stock != "" && unit_price != "" && discount != "" && overview_en != "" && overview_ar != "" && description_en != "" && description_ar != "" && thumbnail != "" && stock_detail_images != "") {
        alert("Successfully, the new data is saved.");
        return true;
    }
}

// add new product
function addNewProd() {
    document.getElementById("addProdu").insertRow(-1).innerHTML = '<div class="form-group card pb-2"><div class="row"><div class="col-sm-6"><label class="px-2 pt-2">English Name: </label><input type="text" class="form-control" placeholder="Product English Name" id="name_en" name="name_en" required></div><div class="col-sm-6"><label class="px-2 pt-2">Arabic Name: </label><input type="text" class="form-control" placeholder="Product Arabic Name" id="name_ar" name="name_ar" required></div></div></div><div class="card mb-3"><h4 class="px-2 pt-2">Select Brand, Category:</h4><div class="row m-0"><div class="form-group col-sm-6 pr-1"><label>Brand: </label><select class="form-control" id="brand_id" name="brand_id" appendBrandOptions required></select></div><div class="form-group col-sm-6 pl-1"><label>Category: </label><select class="form-control" id="category_id" name="category_id" appendCatOptions required></select></div></div></div><div class="card mb-3"><h4 class="px-2 pt-2">Write and Select Tags:</h4><div class="row form-group px-1"><div class="col-sm-6"><label>Tags: </label><div class="tags"><select class="form-control" id="tag_id" name="tag_id" appendTagOptions required></select></div></div><div class="col-sm-3"><label>English Tags:</label><input type="text" class="form-control" placeholder="English Tags" id="label_en" name="label_en" required></div><div class="col-sm-3"><label>Arabic Tags:</label><input type="text" class="form-control" placeholder="Arabic Tags" id="label_ar" name="label_ar" required></div></div></div><div class="row m-0"><button class="btn btn_1 p-5" onclick="$(' + '#singleProduct' + ').show();$(this).parent().hide();">Add Single Product</button><button class="btn btn_1 p-5" onclick="$(' + '#singleProduct' + ').hide();$(' + '#multipleProducts' + ').show();$(this).parent().hide();">Add Product Variant</button></div><div class="w100 card px-2 pt-1" id="singleProduct" style="display: none;"><h4 class="pt-2">Single Product Details:</h4><hr style="margin-top: 1px; width: 18%; height: 1.5px; background-color:black;"><h4>Product Options:</h4><div class="details"><div class="detail row"><div class="form-group col-sm-6"><label>English Option: </label><input type="text" class="form-control" placeholder="English Option" id="title_en" name="title_en" required></div><div class="form-group col-sm-6"><label>English Option Value: </label><input type="text" class="form-control" placeholder="English Option Value" id="name_en" name="name_en" required></div><div class="form-group col-sm-6"><label>Arabic Option: </label><input type="text" class="form-control" placeholder="Arabic Option" id="title_ar" name="title_ar" required></div><div class="form-group col-sm-6"><label>Arabic Option Value: </label><input type="text" class="form-control" placeholder="Arabic Option Value" id="name_ar" name="name_ar" required></div></div><div class="row m-0"><div class="form-group col-sm-6 pl-1"><label>Shop Keeping Unit: </label><input type="text" class="form-control" placeholder="Product SKU" id="sku" name="sku" required></div><div class="form-group col-sm-6 pr-1"><label>Quantity in Stock: </label><input type="number" checkValue="int" class="form-control" placeholder="Product Quantity" min="0" max="99" id="stock" name="stock" onkeypress="return onlyNumberKey(event)" required></div></div><div class="row m-0"><div class="form-group col-sm-6 pl-1"><label>Price: </label><div class="input-group"><input type="number" class="form-control" placeholder="Product Price" id="unit_price" name="unit_price" onkeypress="return onlyNumberKey(event)" required><div class="input-group-append"><span class="input-group-text">EGP</span></div></div></div><div class="form-group col-sm-6 pr-1"><label>Discount: </label><div class="input-group"><input type="number" checkValue="int" class="form-control" placeholder="Product Discount" min="0" max="99" onkeypress="return onlyNumberKey(event)" id="discount" name="discount" required><div class="input-group-append"><span class="input-group-text">%</span></div></div></div></div><div class="row m-0"><div class="form-group col-sm-6 pl-1"><label>English Discription: </label><input type="text" class="form-control" placeholder="Small English Description" id="overview_en" name="overview_en" required></div><div class="form-group col-sm-6 pr-1"><label>Arabic Description: </label><input type="text" class="form-control" placeholder="Small Arabic Description" id="overview_ar" name="overview_ar" required></div></div><div class="row m-0"><div class="form-group col-sm-6 pl-1"><label>Full English Discription: </label><textarea class="form-control" placeholder="Full English Description" rows="5" cols="30" maxlength="500" id="description_en" name="description_en" required></textarea><div class="stopWarning"></div></div><div class="form-group col-sm-6 pl-1"><label>Full Arabic Discription: </label><textarea class="form-control" placeholder="Full Arabic Description" rows="5" cols="30" maxlength="500" id="description_ar" name="description_ar" required></textarea><div class="stopWarning"></div></div></div><div class="row m-0"><div class="form-group col-sm-6 pl-1"><label>Main Image(in Low Resolution): </label><input type="file" class="form-control-file" accept="image/jpeg,image/png,image/jpg" id="thumbnail" name="thumbnail" required></div><div class="form-group col-sm-6 pl-1"><label>Other Images(in High Resolution): </label><input type="file" class="form-control-file" multiple accept="image/jpeg,image/png,image/jpg" id="stock_detail_images" name="stock_detail_images" required></div></div></div></div><div class="w100 card px-2 pt-1" id="multipleProducts" style="display:none;"><h4 class="pt-2">Multiple Product Details:</h4><hr style="margin-top: 1px; width: 18%; height: 1.5px; background-color:black;"><h4>Product Options:</h4><div class="details"><div class="detail row m-0"><div class="form-group col-sm-6 pl-1"><label>English Option: </label><input type="text" class="form-control" placeholder="English Option" id="title_en" name="title_en" required></div><div class="form-group col-sm-6 pl-1"><label>English Option Value: </label><input type="text" class="form-control" placeholder="English Option Value" id="name_en" name="name_en" required></div><div class="form-group col-sm-6 pl-1"><label>Arabic Option: </label><input type="text" class="form-control" placeholder="Arabic Option" id="title_ar" name="title_ar" required></div><div class="form-group col-sm-6 pl-1"><label>Arabic Option Value: </label><input type="text" class="form-control" placeholder="Arabic Option Value" id="name_ar" name="name_ar" required></div></div></div><div class="row"><div class="form-group col-sm-6"><label class="px-2 pt-2">English Name: </label><input type="text" class="form-control" placeholder="English Name" id="name_en" name="name_en" required></div><div class="form-group col-sm-6"><label class="px-2 pt-2">Arabic Name: </label><input type="text" class="form-control" placeholder="Arabic Name" id="name_ar" name="name_ar" required></div></div><div class="row"><div class="form-group col-sm-6"><label class="px-2 pt-2">English Description: </label><input type="text" class="form-control" placeholder="Small English Description" id="overview_en" name="overview_en" required></div><div class="form-group col-sm-6"><label class="px-2 pt-2">Arabic Description: </label><input type="text" class="form-control" placeholder="Small Arabic Description" id="overview_ar" name="overview_ar" required></div></div><div class="row"><div class="form-group col-sm-6"><label class="px-2 pt-2">Price: </label><input type="number" class="form-control" placeholder="Product Price" id="unit_price" name="unit_price" onkeypress="return onlyNumberKey(event)" required></div><div class="form-group col-sm-6"><label class="px-2 pt-2">Discount: </label><input type="number" class="form-control" placeholder="Product Discount" id="discount" name="discount" onkeypress="return onlyNumberKey(event)" required></div></div><div class="row"><div class="form-group col-sm-6"><label class="px-2 pt-2">Shop Keeping Unit: </label><input type="text" class="form-control" placeholder="Product SKU" id="sku" name="sku" required></div><div class="form-group col-sm-6"><label class="px-2 pt-2">Quantity in Stock: </label><input type="text" class="form-control" placeholder="Product Quantity" id="stock" name="sku" required></div></div><div class="row"><div class="form-group col-sm-6"><label class="px-2 pt-2">Main Image: </label><input type="file" class="form-control-file" accept="image/jpeg,image/png,image/jpg" id="thumbnail" name="thumbnail" required></div><div class="form-group col-sm-6"><label class="px-2 pt-2">Extra Image: </label><input type="file" class="form-control-file" multiple accept="image/jpeg,image/png,image/jpg" id="stock_detail_images" name="stock_detail_images" required></div></div></div><button class="btn btn_1 p-5" onclick="saveProdc();">Save Product</button>';
}
/* ===================================================================================================== */

(function ($) {
    "use strict";

    $(".popup-youtube, .popup-vimeo").magnificPopup({
        // disableOn: 700,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    var review = $(".textimonial_iner");
    if (review.length) {
        review.owlCarousel({
            items: 1,
            loop: true,
            dots: true,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 5000,
            nav: false,
            responsive: {
                0: {
                    margin: 15
                },
                600: {
                    margin: 10
                },
                1000: {
                    margin: 10
                }
            }
        });
    }
    var best_product_slider = $(".best_product_slider");
    if (best_product_slider.length) {
        best_product_slider.owlCarousel({
            items: 4,
            loop: true,
            dots: false,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 5000,
            nav: true,
            navText: ["next", "previous"],
            responsive: {
                0: {
                    margin: 15,
                    items: 1,
                    nav: false
                },
                576: {
                    margin: 15,
                    items: 2,
                    nav: false
                },
                768: {
                    margin: 30,
                    items: 3,
                    nav: true
                },
                991: {
                    margin: 30,
                    items: 4,
                    nav: true
                }
            }
        });
    }

    //product list slider
    var product_list_slider = $(".product_list_slider");
    if (product_list_slider.length) {
        product_list_slider.owlCarousel({
            items: 1,
            loop: true,
            dots: false,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 5000,
            nav: true,
            navText: ["next", "previous"],
            smartSpeed: 1000,
            responsive: {
                0: {
                    margin: 15,
                    nav: false,
                    items: 1
                },
                600: {
                    margin: 15,
                    items: 1,
                    nav: false
                },
                768: {
                    margin: 30,
                    nav: true,
                    items: 1
                }
            }
        });
    }

    if ($(".img-gal").length > 0) {
        $(".img-gal").magnificPopup({
            type: "image",
            gallery: {
                enabled: true
            }
        });
    }

    // niceSelect js code
    $(document).ready(function () {
        $("select").niceSelect();
    });

    // menu fixed js code
    $(window).scroll(function () {
        var window_top = $(window).scrollTop() + 1;
        if (window_top > 50) {
            $(".main_menu").addClass("menu_fixed animated fadeInDown");
        } else {
            $(".main_menu").removeClass("menu_fixed animated fadeInDown");
        }
    });

    $(".counter").counterUp({
        time: 2000
    });

    $(".slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        speed: 300,
        infinite: true,
        asNavFor: ".slider-nav-thumbnails",
        autoplay: true,
        pauseOnFocus: true,
        dots: true
    });

    $(".slider-nav-thumbnails").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".slider",
        focusOnSelect: true,
        infinite: true,
        prevArrow: false,
        nextArrow: false,
        centerMode: true,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerMode: false
                }
            }
        ]
    });

    // Search Toggle
    $("#search_input_box").hide();
    $("#search_1").on("click", function () {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
    $("#close_search").on("click", function () {
        $("#search_input_box").slideUp(500);
    });

    //------- Mailchimp js --------//
    function mailChimp() {
        $("#mc_embed_signup").find("form").ajaxChimp();
    }
    mailChimp();

    //------- makeTimer js --------//
    function makeTimer() {
        //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");
        var endTime = new Date("27 Sep 2019 12:56:00 GMT+01:00");
        endTime = Date.parse(endTime) / 1000;

        var now = new Date();
        now = Date.parse(now) / 1000;

        var timeLeft = endTime - now;

        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor((timeLeft - days * 86400) / 3600);
        var minutes = Math.floor((timeLeft - days * 86400 - hours * 3600) / 60);
        var seconds = Math.floor(
            timeLeft - days * 86400 - hours * 3600 - minutes * 60
        );

        if (hours < "10") {
            hours = "0" + hours;
        }
        if (minutes < "10") {
            minutes = "0" + minutes;
        }
        if (seconds < "10") {
            seconds = "0" + seconds;
        }

        $("#days").html("<span>Days</span>" + days);
        $("#hours").html("<span>Hours</span>" + hours);
        $("#minutes").html("<span>Minutes</span>" + minutes);
        $("#seconds").html("<span>Seconds</span>" + seconds);
    }

    // click counter js
    (function () {
        window.inputNumber = function (el) {
            var min = el.attr("min") || false;
            var max = el.attr("max") || false;

            var els = {};

            els.dec = el.prev();
            els.inc = el.next();

            el.each(function () {
                init($(this));
            });

            function init(el) {
                els.dec.on("click", decrement);
                els.inc.on("click", increment);

                function decrement() {
                    var value = el[0].value;
                    value--;
                    if (!min || value >= min) {
                        el[0].value = value;
                    }
                }

                function increment() {
                    var value = el[0].value;
                    value++;
                    if (!max || value <= max) {
                        el[0].value = value++;
                    }
                }
            }
        };
    })();

    inputNumber($(".input-number"));

    setInterval(function () {
        makeTimer();
    }, 1000);

    // click counter js

    // var a = 0;
    // $('.increase').on('click', function(){

    //   console.log(  $(this).innerHTML='Product Count: '+ a++ );
    // });

    var product_overview = $("#vertical");
    if (product_overview.length) {
        product_overview.lightSlider({
            gallery: true,
            item: 1,
            verticalHeight: 450,
            thumbItem: 4,
            slideMargin: 0,
            speed: 600,
            autoplay: true,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        item: 1
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        item: 1,
                        slideMove: 1,
                        verticalHeight: 350
                    }
                }
            ]
        });
    }

    // Carousel
    $(".carousel").carousel({
        interval: 4000
    });

    // dealing with category product area
    $(".sub-menu ul").hide();
    $(".sub-menu a").click(function () {
        $(this).parent(".sub-menu").children("ul").slideToggle("100");
        $(this).find(".right").toggleClass("ti-plus ti-minus");
    });

    // Dealing with best offer
    if ($(".best_offer_iner").length > 0) {
        var containerEl = document.querySelector(".best_offer_iner");
        var mixer = mixitup(containerEl);
    }
    //  $('.controls').on('click', function(){
    //   $('.controls').removeClass('add');
    //   $('.controls').addClass('add');
    //  });

    $(".controls").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
})(jQuery);

//=============================================================================
