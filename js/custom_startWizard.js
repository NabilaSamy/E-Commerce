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

// count textarea words
$(function () {
    'use strict';
    var maxTest = $('textarea').attr('maxlength');
    $('.stopWarning').html('<span></span>Warning! " <span>' + maxTest + '</span> " Words Remaining.');
    $('textarea').keyup(function () {
        var textLength = $(this).val().length,
            remWord = maxTest - textLength;
        $('.stopWarning').html('<span></span>Warning! " <span>' + remWord + '</span> " Words Remaining.');
    });
});

// search function
function webSearch() {

    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200) {
            putData(res.data);
        } else {
            alert('error');
        }
    }
}

// <input type="number"> must be numbers only
function onlyNumberKey(evt) {
    // Only ASCII charactar in that range allowed 
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) // from 48 to 57 in numbers from 0 to 9
        return false;
    return true;
}


// api for categories
$.ajax({
    method: "GET",
    url: "http://webdev.exabyte-eg.com/APIs/eCommerce/"
}).done(function (data) {
    $("#search_input").empty();
});

/* ================================================================================================== */

// signup function
function signUp() {
    var first_name = document.forms["form_signup"]["first_name"].value;
    var last_name = document.forms["form_signup"]["last_name"].value;
    var email_address = document.forms["form_signup"]["email_address"].value;
    var password = document.forms["form_signup"]["password"].value;
    var myFile = document.forms["form_signup"]["myFile"].value;

    if (first_name != "" && last_name != "" && email_address != "" && password != "" && myFile != "") {
        alert("Successfully Signup!, Click to 'Next Step' Button.");
    }
}

// signup api
$("#sigup").on("submit", function () {
    var first_name = $("#first_name").val();
    var last_name = $("#last_name").val();
    var address = $("#address").val();
    var email_address = $("#email_address").val();
    var psw = $("#psw").val();

    // input confirmation here

    Signup(first_name, last_name, address, email_address, psw);

    return false;
});

function Signup(given_first_name, given_last_name, given_address, given_email_address, given_psw) {
    var data = JSON.stringify({
        first_name: given_first_name,
        last_name: given_last_name,
        address: given_address,
        email_address: given_email_address,
        psw: given_psw
    });

    $.ajax({
        method: "POST",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/access/signup",
        data: data
    }).done(function (res) {
        if (res["user"]) {
            var user = res["user"][0];
        } else {
            var type = res["type"];
            var msg = res["msg"];
            alert(type + "\n" + msg);
        }
    });
}

/* ===================================================================================================== */

// save org. data in 'org_Detail.html'
function saveOrg() {
    var en_name = document.forms["orgDetail"]["en_name"].value;
    var ar_name = document.forms["orgDetail"]["ar_name"].value;
    var org_address_1 = document.forms["orgDetail"]["org_address_1"].value;
    var org_address_2 = document.forms["orgDetail"]["org_address_2"].value;
    var email = document.forms["orgDetail"]["email"].value;
    var telephone = document.forms["orgDetail"]["telephone"].value;
    var myFile = document.forms["orgDetail"]["myFile"].value;

    if (en_name != "" && ar_name != "" && org_address_1 != "" && org_address_2 != "" && email != "" && telephone != "" && myFile != "") {
        alert("Successfully, the new data is saved.");
    }
}

/* ===================================================================================================== */

// save data in 'userProfile,html'
function saveProfile() {
    "use strict";
    var first_name = document.forms["profile"]["first_name"].value;
    var middle_name = document.forms["profile"]["middle_name"].value;
    var last_name = document.forms["profile"]["last_name"].value;
    var email_address = document.forms["profile"]["email_address"].value;
    var password = document.forms["profile"]["password"].value;
    var myFile = document.forms["profile"]["myFile"].value;

    if (first_name != "" && middle_name != "" && last_name != "" && email_address != "" && password != "" && myFile != "") {
        alert("Successfully, the new data is saved.");
    }
}

/* ===================================================================================================== */

// Dealing with Tabs
$(".addDB .tab-switch li, .orders, .settingWeb, .survey").click(function () {
    "use strict";
    // Add Selected Class to active link
    $(this).addClass("selected").siblings().removeClass("selected");
    // Hide All Divs
    $(".addDB .tabs-content .tab-content-1, .addDB .tabs-content .tab-content-2,.addDB .tabs-content .tab-content-3").hide();
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

/* ---------------------------------------------------------------------------------- */

// Deals with Brand
//listner
$(document).on("keyup", "input.updateBrand", function () {
    if ($(this).attr("main-value").toLowerCase() !== $(this).val().toLowerCase())
        $(this).closest("tr[status]").attr("status", "updated");
    else {
        var res = $(this).closest("tr[status]").find("input.updateBrand").length;
        $(this).closest("tr[status]").find("input.updateBrand").each(function (i, e) {
            if ($(e).attr("main-value").toLowerCase() != $(e).val().toLowerCase())
                res--;
        });
        if (res == $(this).closest("tr[status]").find("input.updateBrand").length)
            $(this).closest("tr[status]").attr("status", "appended");
    }
});

//addNewBrand
function addNewBrand() {
    $("#outputBrands").prepend('<tr status="new"><td><input class="brandEn form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" value="" json-attr="placeholder,Brand_en_name_ph" placeholder="Brand English Name" required></td><td><input class="brandAr form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" value=""  json-attr="placeholder,Brand_ar_name_ph" placeholder="Brand Arabic Name" required></td><td style="font-size: 20px;"><input class="delete" type="checkbox"> Delete</td></tr>');
}

//output brands
function getBrands() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/brands?company_id=1"
    }).done(function (data) {
        $("#outputBrands").empty();
        var output = "";
        for (var i in data["brands"]) {
            var id = data["brands"][i]["id"];
            var en_name = data["brands"][i]["en_name"];
            var ar_name = data["brands"][i]["ar_name"];
            output += '<tr status="appended" brand-id="' + id + '">' + '<td><input class="updateBrand brandEn form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" main-value="' + en_name + '" value="' + en_name + '"></td>' + '<td><input class="updateBrand brandAr form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" main-value="' + ar_name + '" value="' + ar_name + '"></td>' + '<td style="font-size: 20px;"><input class="delete" type="checkbox"> Delete</td>' + "</tr>";

        }
        $("#outputBrands").append(output);
    }).fail(function (res) {
        console.log(res);
    });
}
getBrands();

$("#brandsForm").on("submit", function () {

    $(this).find("tr[status]").each(function (i, e) {

        if ($(e).find("input.delete:checked").length > 0) {
            if ($(e).attr("brand-id")) {
                var fm = new FormData();
                fm.append('data', JSON.stringify({
                    "id": $(e).attr("brand-id")
                }));
                BrandApi('DELETE', fm);
            }
        } else if ($(e).attr("status") == "updated") {
            if ($(e).attr("brand-id") && $(e).find("input.brandEn").val() && $(e).find("input.brandAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "id": $(e).attr("brand-id"),
                    "en_name": $(e).find("input.brandEn").val(),
                    "ar_name": $(e).find("input.brandAr").val()
                }));

                BrandApi('PUT', data);
            }
        } else if ($(e).attr("status") == "new") {
            if ($(e).find("input.brandEn").val() && $(e).find("input.brandAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "company_id": 1,
                    "en_name": $(e).find("input.brandEn").val(),
                    "ar_name": $(e).find("input.brandAr").val()
                }));

                BrandApi('POST', data);
            }
        }
    });

    function BrandApi(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.response);
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/brands");
        xhr.send(d);
        getBrands();
    }

    return false;
});

/* ---------------------------------------------------------------------------------- */

// Deals with Category
//listner
/*$(document).on("keyup", "input.updateCategory", function () {
    if ($(this).attr("main-value").toLowerCase() !== $(this).val().toLowerCase())
        $(this).closest("tr[status]").attr("status", "updated");
    else {
        var res = $(this).closest("tr[status]").find("input.updateCategory").length;
        $(this).closest("tr[status]").find("input.updateCategory").each(function (i, e) {
            if ($(e).attr("main-value").toLowerCase() != $(e).val().toLowerCase())
                res--;
        });
        if (res == $(this).closest("tr[status]").find("input.updateCategory").length)
            $(this).closest("tr[status]").attr("status", "appended");
    }
});*/


/*$(document).on('click', "[file-target]", function () {
    var target = $(this).attr('file-target');
    $(target).click();
});*/

//var catOptions;
//addNewCategory
/*function addNewCategory() {
    $('#cat_display').prepend('<div class="row m-0"><form class="col p-0" cat-form><div class="row m-0"><div class="col p-1 form-group"><input type="text" class="form-control" json-attr="placeholder,cat_en_name_ph" placeholder="Cat. English Name" name="en" value="" required></div><div class="col p-1 form-group"><input type="text" class="form-control" json-attr="placeholder,cat_ar_name_ph" placeholder="Cat. Arabic Name" name="ar" value="" required></div><div class="col p-1 form-group"><input type="text" class="form-control" json-attr="placeholder,cat_url_ph" placeholder="Cat. URL" name="href" value="" required></div><div class="col p-1 form-group">' + ' <select class="form-control"> <option value="0" json-attr="placeholder,cat_parent_cat_ph">none</option>' + catOptions + '</select>' + '</div><div class="col p-1 form-group"><img src="" alt=""><input type="file" class="form-control-file" style="bottom: 13px; position: relative;" accept="image/*" name="img" required></div></div><button type="submit" class="btn btn_cat">Save Category</button><button type="button" onclick="cancelNewCat(this);" class="btn btn_cat">Delete Category</button>');
}*/

//output categories
/*function getCategories() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories?company_id=1"
    }).done(function (data) {
        console.log(data);
        $("#cat_display").empty();
        var output = "";
        catData = data;
        for (var i in data["categories"]) {
            var id = data["categories"][i]["id"];
            var en_name = data["categories"][i]["en_name"];
            var ar_name = data["categories"][i]["ar_name"];
            var href = data["categories"][i]["url"];
            var img = data["categories"][i]["img_url"];
            var parent = data["categories"][i]["parent_id"];

            catOptions += '<option value="' + id + '"> ' + en_name + ' - ' + ar_name + '</option>';

            var parentOutput = "";
            for (var j in data["categories"]) {
                var selectId = data["categories"][j]["id"];
                var selectEn_name = data["categories"][j]["en_name"];
                var selectAr_name = data["categories"][j]["ar_name"];
                var selectParent = data["categories"][j]["parent_id"];
                var selected = '';

                if (selectId === parent) selected = 'selected'
                else selected = '';

                parentOutput += '<option value="' + selectId + '" ' + selected + '> ' + selectEn_name + ' - ' + selectAr_name + '</option>';
            }

            output +=
                '<div class="row m-0">' +
                '<form class="col p-0" cat-form="' + id + '">' +
                '<div class="row m-0"><div class="col p-1 form-group">' +
                '<input type="text" class="form-control" json-attr="placeholder,cat_en_name_ph" placeholder="Cat. English Name" name="en" value="' + en_name + '" required>' +
                '</div><div class="col p-1 form-group">' +
                '<input type="text" class="form-control" json-attr="placeholder,cat_ar_name_ph" placeholder="Cat. Arabic Name" name="ar" value="' + ar_name + '" required>' +
                '</div><div class="col p-1 form-group">' +
                '<input type="text" class="form-control" json-attr="placeholder,cat_url_ph" placeholder="Cat. URL" name="href" value="' + href + '" required>' +
                '</div><div class="col p-1 form-group">' +
                ' <select class="form-control"> <option value="0" json-attr="placeholder,cat_parent_cat_ph">none</option>' +
                parentOutput + '</select>' +
                '</div><div class="col p-1 form-group">' +
                '<button type="button" file-target="#file' + id + '">choose img<img src="' + img + '" alt=""></button>' +
                '<input id="file' + id + '" style="visibility:hidden;" type="file"  accept="image/*" name="img" required>' +
                "</div></div>" + '<button type="button" onclick="saveCate(this);" class="btn btn_cat">Save Category</button>' + '<button type="button" onclick="cancelNewCat(this);" class="btn btn_cat">Delete Category</button>' + "</form></div>" + "\n";
        }
        $("#cat_display").append(output);
    });
}*/
//getCategories();

// Save Category Function
/*function saveCate(e) {
    $(e).parentsUntil('div.row.m-0').appendTo();
}*/

// Delete Category Function
/*function cancelNewCat(e) {
    $(e).parentsUntil('div.row.m-0').remove();
}*/

/*$("#categoriesForm").on("submit", function () {
    $(this).find("tr[status]").each(function (i, e) {
        if ($(e).find("input.delete:checked").length > 0) {
            if ($(e).attr("category-id")) {
                var fm = new FormData();
                fm.append('data', JSON.stringify({
                    "id": $(e).attr("category-id")
                }));
                CatAPI('DELETE', fm);
            }

        } else if ($(e).attr("status") == "updated") {
            if ($(e).attr("category-id") && $(e).find("input.categoryEn").val() && $(e).find("input.categoryAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "id": $(e).attr("category-id"),
                    "en_name": $(e).find("input.categoryEn").val(),
                    "ar_name": $(e).find("input.categoryAr").val(),
                    "url": "#" + $(e).find("input.categoryEn").val(),
                    "parent_id": $(e).find("input.mainCategory").val()
                }));
                CatAPI('PUT', data);
            }
        } else if ($(e).attr("status") == "new") {
            var en_name = $(e).find("input.categoryEn").val();
            var ar_name = $(e).find("input.categoryAr").val();
            var cat_href = "#" + cat_en; //$(e).find("input.categoryEn").val();
            var cat_parent = $(e).find("input.mainCategory").val();
            var cat_img = $(e).find("input.categoryImg")[0].files[0];

            if (en_name && ar_name && cat_href && cat_parent && cat_img) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "company_id": 1,
                    "en_name": $(e).find("input.categoryEn").val(),
                    "ar_name": $(e).find("input.categoryAr").val(),
                    "url": '#',
                    "parent_id": $(e).find("input.mainCategory").val(),
                    "img_url": "catimg"
                }));
                data.append('catimg', cat_img);
                CatAPI('POST', data);
            }
        }
    });

    function CatAPI(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.response);
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories");
        xhr.send(d);
        getCategories();
    }

    return false;
});*/


console.clear();

// Get Category's Parent
function getParent(e, match) {
    while (e && e.parentNode && e.parentNode.parentNode) {
        e = e.parentNode;
        if (e.matches(match)) return e;
    }
    return null;
}

document.addEventListener('click', function (event) {
    var ee = event.target;
    if (ee.matches('#cats div.view button.edit')) editCat(ee);
    else if (ee.matches('#cats .catItem form button.cancel')) viewCat(ee);
    else if (ee.matches('#cats .catItem form button.delete')) deleteCat(ee);
    else if (ee.matches('button.cat-refresh')) getCats();
    else if (ee.matches('button.cat-add')) addCatHtml();
});

document.addEventListener('submit', function (event) {
    var ee = event.target;
    if (ee.matches('#cats .catItem form.edit')) {
        event.preventDefault();
        //showLoading();
        var data = {};
        var formdata = new FormData();
        var serFormData = $(ee).serializeArray();
        for (var item of serFormData) {
            var name = item['name'];
            var value = item['value'];
            data[name] = value;
        }

        if (Object.entries(data).length > 0) {
            data['id'] = ee.getAttribute('cat');
            formdata.append('data', JSON.stringify(data));
            CatApi('PUT', formdata);
        }

        var file = ee.querySelector('[type="file"]');
        if (file.files[0]) {}
        viewCat(ee);
    } else if (ee.matches('#cats div.new form.newCat')) {
        event.preventDefault();
        //showLoading();
        var data = {};
        var formdata = new FormData();
        var serFormData = $(ee).serializeArray();
        for (var item of serFormData) {
            var name = item['name'];
            var value = item['value'];
            data[name] = value;
        }
        data['img_url'] = 'img_url';
        data['company_id'] = 1;
        var file = ee.querySelector('[type="file"]');
        formdata.append('data', JSON.stringify(data));
        formdata.append('img_url', file.files[0]);
        CatApi('POST', formdata);
    }

    // Categories API
    function CatApi(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onloadend = function () {
            console.log(xhr.response);
            getCats();
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories");
        xhr.send(d);
    };

    // Category's Image API
    function CatApiImg(d) {
        var xhr = new XMLHttpRequest();
        xhr.onloadend = function () {
            console.log(xhr.response);
            getCats();
        }
        xhr.open("POST", "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories/media");
        xhr.send(d);
    }
});

// Make HTML for Category
function addCatHtml() {
    var output = $('#cats div.new');
    var html =
        '<form class="newCat row w-100 m-0 p-3" enctype="multipart/form-data" >' +
        '<div class="col-sm-4 p-1 form-group"> <label>Name:</label>' +
        '<input type="text" name="en_name"  class="form-control" placeholder="Enter English Name" required> </div>' +
        '<div class="col-sm-4 p-1 form-group"> <label>Arabic Name:</label>' +
        '<input type="text" name="ar_name" class="form-control" placeholder="Enter Arabic Name" required> </div>' +
        '<div class="col-sm-4 p-1 form-group"> <label>Url:</label>' +
        '<input type="text" name="url"  class="form-control" placeholder="Enter URL" required></div>' +
        '<div class="col-sm-6 p-1 form-group"><label>Parent:</label>' +
        '<select name="parent_id" class="form-control" required>' + catSelectOptions + '</select></div>' +
        '<div class="col-sm-6 p-1 form-group"><label>Image:</label>' +
        '<input type="file" accept="image/jpeg, image/png" name="img_url" class="form-control-file border" required></div>' +
        '<div class="col p-1"></div>' +
        '<div class="form-group mr-3 p-1"><button type="button" remove="form.newCat" class="btn btn-light border pl-5 pr-5 w-100 h-100">Cancel</button></div>' +
        '<div class="form-group p-1"><button type="submit" class="btn btn-success pl-5 pr-5 w-100 h-100 btn_add">Add</button></div>' +
        '</form>';
    $(output).prepend(html);
}

// View all Categories
function viewCat(e) {
    if (!e.matches('div.catItem')) e = getParent(e, 'div.catItem');
    e.querySelector('div.view').style.display = 'flex';
    e.querySelector('form.edit').style.display = 'none';
}

// Edit Category
function editCat(e) {
    if (!e.matches('div.catItem')) e = getParent(e, 'div.catItem');
    e.querySelector('div.view').style.display = 'none';
    e.querySelector('form.edit').style.display = 'flex';
}

document.addEventListener('change', function (event) {
    var ee = event.target;
    if (ee.matches('[data-name]')) {
        var dName = ee.getAttribute('data-name');
        var dVal = (ee.hasAttribute('data-value') ? ee.getAttribute('data-value').toLowerCase() : null);
        var value = ee.value.toLowerCase();
        ee.setAttribute('name', dName);
        if (dVal)
            if (value == dVal) ee.removeAttribute('name');
    }
});

var catSelectOptions = '<option value="null">None</option>';

// get Categories
function getCats() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories?company_id=1"
    }).done(function (data) {
        var catData = data['categories'];
        $('#cats div.api').empty();
        catSelectOptions = '<option value="null">None</option>';
        for (var i in catData) {
            var cId = catData[i]['id'];
            var cEn = catData[i]['en_name'];
            var cAr = catData[i]['ar_name'];
            var cHref = catData[i]['url'];
            var cImg = catData[i]['img_url'];
            var cParent = catData[i]['parent_id'];
            var cActive = catData[i]['active'];

            var selectOptions = '<option value="null">None</option>';
            for (var j in catData) {
                var csId = catData[j]['id'];
                var csEn = catData[j]['en_name'];
                var csAr = catData[j]['ar_name'];
                var selected = '';
                if (cId !== csId) {
                    if (csId === cParent) selected = 'selected';
                    selectOptions += '<option value="' +
                        csId + '" ' + selected + '>' + csEn + ' - ' + csAr + '</option>';
                }
            }
            catSelectOptions += '<option value="' + cId + '">' + cEn + ' - ' + cAr + '</option>';

            var output = $('#cats div.api');
            if (cParent > 0) {
                output = $('#cats div.api div.sub[sub-id="' + cParent + '"]');
                $('#cats div.api div.catGroup.' + cParent).addClass('parent');
            }

            var html = '<div class="catGroup m-0 w-100 ' + cId + '">' +
                '<div class="main w-100"><div class="catItem row m-1 w-100 border"><div class="view row w-100 m-0">' +
                '<div class="col-5"><p class="w-100 h-100 m-0 text-break font-weight-bold">' + cEn + '</p></div>' +
                '<div class="col"><p class="w-100 h-100 m-0 text-break"><strong>ar: </strong>' + cAr + '</p></div>' +
                '<div class="col"><p class="w-100 h-100 m-0 text-break"><strong>url: </strong>' + cHref + '</p></div>' +
                '<div class="col"><img class="w-100 h-100 img-contain" src="' + cImg + '" alt="' + cEn + " - " + cAr + '"></div>' +
                '<div class=" p-1"><button class="edit btn btn-primary w-100 h-100 fas fa-edit"></button></div></div>' +
                '<form class="edit row w-100 m-0 p-3" enctype="multipart/form-data" cat="' + cId + '"> ' +

                '<div class="col-sm-4 p-1 form-group"> <label>Name:</label>' +
                '<input type="text" data-name="en_name" data-value="' + cEn + '" value="' + cEn + '" class="form-control" placeholder="Enter English Name"> </div>' +

                '<div class="col-sm-4 p-1 form-group"> <label>Arabic Name:</label>' +
                '<input type="text" data-name="ar_name" data-value="' + cAr + '" value="' + cAr + '" class="form-control" placeholder="Enter Arabic Name"> </div>' +

                '<div class="col-sm-4 p-1 form-group"> <label>Url:</label>' +
                '<input type="text" data-name="url" data-value="' + cHref + '" value="' + cHref + '" class="form-control" placeholder="Enter URL"></div>' +

                '<div class="col-sm-6 p-1 form-group"><label>Parent:</label>' +
                '<select data-name="parent_id" data-value="' + cParent + '" value="' + cParent + '" class="form-control">' + selectOptions + '</select></div>' +

                '<div class="col-sm-6 p-1 form-group"><label>Image:</label>' +
                '<input type="file" accept="image/jpeg, image/png" data-name="img_url" class="form-control-file border"></div>' +

                '<div class="form-group p-1"><button type="button" class="delete btn btn-danger w-100 h-100 pl-5 pr-5" delete-id="' + cId + '">Delete</button></div>' +

                '<div class="col p-1"></div>' +
                '<div class="form-group mr-3 p-1"><button type="button" class="cancel btn btn-light border pl-5 pr-5 w-100 h-100">Cancel</button></div>' +
                '<div class="form-group p-1"><button type="submit" class="btn btn-success pl-5 pr-5 w-100 h-100 btn_save">Save</button></div>' +

                '</form></div></div><div class="sub" sub-id="' + cId + '"></div></div>';
            $(output).append(html);
        }
    });
}
getCats();
/* ---------------------------------------------------------------------------------- */

// Deals with Tag
//listner
$(document).on("keyup", "input.updateTag", function () {
    if ($(this).attr("main-value").toLowerCase() !== $(this).val().toLowerCase())
        $(this).closest("tr[status]").attr("status", "updated");
    else {
        var res = $(this).closest("tr[status]").find("input.updateTag").length;
        $(this).closest("tr[status]").find("input.updateTag").each(function (i, e) {
            if ($(e).attr("main-value").toLowerCase() != $(e).val().toLowerCase())
                res--;
        });
        if (res == $(this).closest("tr[status]").find("input.updateTag").length)
            $(this).closest("tr[status]").attr("status", "appended");
    }
});

// add NewTag
function addNewTag() {
    $("#outputTags").prepend('<tr status="new"><td><input class="tagEn form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" value="" json-attr="placeholder,tag_en_name_ph" placeholder="Tag English Name" required></td><td><input class="tagAr form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" value="" json-attr="placeholder,tag_ar_name_ph" placeholder="Tag Arabic Name" required></td><td style="font-size: 20px;"> <input class="delete" type="checkbox">Delete</td></tr>');
}

//output tags
function getTags() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/tags?company_id=1"
    }).done(function (data) {
        $("#outputTags").empty();
        var output = "";
        for (var i in data["tags"]) {
            var id = data["tags"][i]["id"];
            var en_name = data["tags"][i]["en_name"];
            var ar_name = data["tags"][i]["ar_name"];
            output += '<tr status="appended" tag-id="' + id + '">' + '<td><input class="updateTag tagEn form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" main-value="' + en_name + '" value="' + en_name + '"></td>' + '<td><input class="updateTag tagAr form-control text-center" style = "width: 50%; position: relative; left: 132px;" type="text" main-value="' + ar_name + '" value="' + ar_name + '"></td>' + '<td style="font-size: 20px;"><input class="delete" type="checkbox"> Delete</td>' + "</tr>";
        }
        $("#outputTags").append(output);
    }).fail(function (res) {
        console.log(res);
    });
}
getTags();

$("#tagsForm").on("submit", function () {

    $(this).find("tr[status]").each(function (i, e) {

        if ($(e).find("input.delete:checked").length > 0) {
            if ($(e).attr("tag-id")) {
                var fm = new FormData();
                fm.append('data', JSON.stringify({
                    "id": $(e).attr("tag-id")
                }));
                TAGApi('DELETE', fm);
            }
        } else if ($(e).attr("status") == "updated") {
            if ($(e).attr("tag-id") && $(e).find("input.tagEn").val() && $(e).find("input.tagAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "id": $(e).attr("tag-id"),
                    "en_name": $(e).find("input.tagEn").val(),
                    "ar_name": $(e).find("input.tagAr").val()
                }));
                TAGApi('PUT', data);
            }
        } else if ($(e).attr("status") == "new") {
            if ($(e).find("input.tagEn").val() && $(e).find("input.tagAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "company_id": 1,
                    "en_name": $(e).find("input.tagEn").val(),
                    "ar_name": $(e).find("input.tagAr").val()
                }));
                TAGApi('POST', data);
            }
        }
    });

    function TAGApi(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.response);
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/tags");
        xhr.send(d);
        getTags();
    }

    return false;
});

/* ===================================================================================================== */

// Deals with Stock Options
//listner
$(document).on("keyup", "input.updateStOption", function () {
    if ($(this).attr("main-value").toLowerCase() !== $(this).val().toLowerCase())
        $(this).closest("tr[status]").attr("status", "updated");
    else {
        var res = $(this).closest("tr[status]").find("input.updateStOption").length;
        $(this).closest("tr[status]").find("input.updateStOption").each(function (i, e) {
            if ($(e).attr("main-value").toLowerCase() != $(e).val().toLowerCase())
                res--;
        });
        if (res == $(this).closest("tr[status]").find("input.updateStOption").length)
            $(this).closest("tr[status]").attr("status", "appended");
    }
});

// addNewStOption
function addNewStOption() {
    $("#outputStOptions").prepend('<tr status="new"><td><input class="stOptionEn form-control text-center" type="text" value="" json-attr="placeholder,option_en_name_ph" placeholder="Option English Name" required></td><td><input class="stOptionAr form-control text-center" type="text" value="" json-attr="placeholder,option_ar_name_ph" placeholder="Option Arabic Name" required></td><td><input class="stValueEn form-control text-center" type="text" value="" json-attr="placeholder,value_en_name_ph" placeholder="Value English Name" required></td><td><input class="stValueAr form-control text-center" type="text" value="" json-attr="placeholder,value_ar_name_ph" placeholder="Value Arabic Name" required></td><td style="font-size: 20px;"><input class="delete" type="checkbox">Delete</td></tr>');
}

//output stock options
function getstOptions() {
    $.ajax({
        method: "GET",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/stock?company_id=1"
    }).done(function (data) {
        $("#outputStOptions").empty();
        var output = "";
        for (var i in data["stOptions"]) {
            var id = data["stOptions"][i]["id"];
            var en_optionName = data["stOptions"][i]["en_optionName"];
            var ar_optionName = data["stOptions"][i]["ar_optionName"];
            var en_valueName = data["stOptions"][i]["en_valueName"];
            var ar_valueName = data["stOptions"][i]["ar_valueName"];
            output += '<tr status="appended" stock-id="' + id + '">' + '<td><input class="updateStOption stOptionEn form-control" type="text" main-value="' + en_optionName + '" value="' + en_optionName + '"></td>' + '<td><input class="updateStOption stOptionAr form-control" type="text" main-value="' + ar_optionName + '" value="' + ar_optionName + '"></td>' + '<td><input class="updateStOption stValueEn form-control" type="text" main-value="' + en_valueName + '" value="' + en_valueName + '"></td>' + '<td><input class="updateStOption stValueAr form-control" type="text" main-value="' + en_valueName + '" value="' + en_valueName + '"></td>' + '<td style="font-size: 20px;"><input class="delete" type="checkbox"> Delete</td>' + "</tr>";
        }
        $("#outputStOptions").append(output);
    }).fail(function (res) {
        console.log(res);
    });
}
getstOptions();

$("#optionsForm").on("submit", function () {

    $(this).find("tr[status]").each(function (i, e) {

        if ($(e).find("input.delete:checked").length > 0) {
            if ($(e).attr("stock-id")) {
                var fm = new FormData();
                fm.append('data', JSON.stringify({
                    "id": $(e).attr("stock-id")
                }));
                stOptionApi('DELETE', fm);
            }
        } else if ($(e).attr("status") == "updated") {
            if ($(e).attr("stock-id") && $(e).find("input.stOptionEn").val() && $(e).find("input.stOptionAr").val() && $(e).find("input.stValueEn").val() && $(e).find("input.stValueAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "id": $(e).attr("stock-id"),
                    "en_stOption": $(e).find("input.stOptionEn").val(),
                    "ar_stOption": $(e).find("input.stOptionAr").val(),
                    "en_stValue": $(e).find("input.stValueEn").val(),
                    "ar_stValue": $(e).find("input.stValueAr").val()
                }));
                stOptionApi('PUT', data);
            }
        } else if ($(e).attr("status") == "new") {
            if ($(e).find("input.stOptionEn").val() && $(e).find("input.stOptionAr").val() && $(e).find("input.stValueEn").val() && $(e).find("input.stValueAr").val()) {
                var data = new FormData();
                data.append('data', JSON.stringify({
                    "company_id": 1,
                    "en_stOption": $(e).find("input.stOptionEn").val(),
                    "ar_stOption": $(e).find("input.stOptionAr").val(),
                    "en_stValue": $(e).find("input.stValueEn").val(),
                    "ar_stValue": $(e).find("input.stValueAr").val()
                }));
                stOptionApi('POST', data);
            }
        }
    });

    function stOptionApi(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.response);
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/stock");
        xhr.send(d);
        getstOptions();
    }

    return false;
});

/* ===================================================================================================== */

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

/* ===================================================================================================== */

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

/* --------------------------------------------------------------------------- */

$.ajax({
    method: "POST",
    url: "http://webdev.exabyte-eg.com/APIs/eCommerce/org/stock"
}).done(function (data) {
    var data = new FormData();
    data.append('data', JSON.stringify({
        "org_id": 1,
        "name_en": $(e).find("input.name_en").val(),
        "name_ar": $(e).find("input.name_ar").val(),
        "title_en": $(e).find("input.title_en").val(),
        "name_en": $(e).find("input.name_en").val(),
        "title_ar": $(e).find("input.title_ar").val(),
        "name_ar": $(e).find("input.name_ar").val(),
        "sku": $(e).find("input.sku").val(),
        "stock": $(e).find("input.stock").val(),
        "unit_price": $(e).find("input.unit_price").val(),
        "discount": $(e).find("input.discount").val(),
        "overview_en": $(e).find("input.overview_en").val(),
        "overview_ar": $(e).find("input.overview_ar").val(),
        "description_en": $(e).find("input.description_en").val(),
        "description_ar": $(e).find("input.description_ar").val(),
        "thumbnail": $(e).find("input.thumbnail").val(),
        "stock_detail_images": $(e).find("input.stock_detail_images").val()
    }));
});

/* ===================================================================================================== */
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

    /*// niceSelect js code
    $(document).ready(function () {
        $("select").niceSelect();
    });*/

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
    /*$("#search_input_box").hide();
    $("#search_1").on("click", function () {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
    $("#close_search").on("click", function () {
        $("#search_input_box").slideUp(500);
    });*/

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

    function productOverview() {
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

/* ===================================================================================================== */
