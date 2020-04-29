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
    var mobile = document.forms["form_signup"]["mobile"].value;
    var email_address = document.forms["form_signup"]["email_address"].value;
    var password = document.forms["form_signup"]["password"].value;
    var myFile = document.forms["form_signup"]["myFile"].value;

    if (first_name != "" && last_name != "" && mobile != "" && email_address != "" && password != "" && myFile != "") {
        alert("Successfully Signup!");
        return true;
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
/* ================================================================================================== */

// login api
$("#login").on("submit", function () {
    var email_address = $("#email_address").val();
    var password = $("#password").val();
    var rem = $("#f-option").is(":checked");

    // input confirmation here

    Login(email_address, password, rem);

    return false;
});

function Login(given_email, given_psw, given_remember) {
    $.ajax({
        method: "POST",
        url: "http://webdev.exabyte-eg.com/APIs/eCommerce/access/login",
        data: '{\n\t"email_address": "' + given_email + '",\n\t"password": "' + given_psw + '"\n}'
    }).done(function (res) {
        if (res["user"]) {
            var user = res["user"][0];
            var session_expiration = 0;
            if (given_remember == true) session_expiration = "30";
            setCookie("uid", user["id"], session_expiration);
        } else {
            var type = res["type"];
            var msg = res["msg"];
            alert(type + "\n" + msg);
        }
    });
}

/* ================================================================================================== */

// forgot password in 'forgot.html'
function validateForgot() {
    "use strict";
    var email_address = document.forms["forgotPass"]["email_address"].value;

    if (email_address != "") {
        alert("Your Email is valid, Now go to your mail and check it!");
        return true;
    }
}

/* ================================================================================================== */

// reset password in 'resetPass.html'
function validatePass() {
    var password = document.forms["resetPass"]["password"].value;
    var cpassword = document.forms["resetPass"]["cpassword"].value;

    if (cpassword != password) {
        alert("Type the same Password!");
        return false;
    } else {
        alert("Successfully, the new password is created.");
        return true;
    }
}

/* ================================================================================================== */

// get & display products
if ($.urLPage().indexOf('category.html') > -1) getProducts();

function getProducts() {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200) {
            putData(res.data);
        } else {
            alert('error');
        }
    }
    xhr.open("GET", eCommerceAPI + "/access/stock?lang=" + getCookie('lang') + "&org_id=1&category=&brand=&keyword=" + ($.urlParam('keyword') ? $.urlParam('keyword') : ''));
    xhr.send();

    function putData(data) {
        var products = document.getElementById('products');
        products.innerHTML = '';

        for (var obj of data) {
            obj.discount = '.' + (obj.discount).replace('.', '0');
            var discPrice = obj.unit_price - (obj.unit_price * obj.discount);

            products.innerHTML += '<div class="col-lg-4 col-sm-6 p-0"><a href="single-product.html?stock=' + obj.id + '"><div  class="single_category_product m-2 shadow"><div class="single_category_img"><img src="' + eCommerceAPI + obj.thumbnail + '" alt="' + obj.name + '" /><div class="category_social_icon"><ul><li><a href="#"><i class="ti-heart"></i></a></li><li><a href="#"><i class="ti-bag"></i></a></li></ul></div><div class="category_product_text"><a href=""><h5>' + obj.name + '</h5></a><p>' + '<i><del>' + obj.unit_price + ' EGP</del></i>  <span class="disPrice">' + discPrice + ' EGP</span>' + '</p></div></div></div></a></div>';
        }

    }

}

// api for categories
$.ajax({
    method: "GET",
    url: "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/categories"
}).done(function (data) {
    $("#catList").empty();

    var arr = data["cats"];
    for (var i in arr) {
        var htmlOutput = "";
        var output = "";

        if (arr[i]["children"]) {
            htmlOutput = '<li class="sub-menu"><a href="#' + arr[i]["en"] + '" catDropdown="' + arr[i]["id"] + '" class="d-flex justify-content-between">' + arr[i]["en"] + '<div class="icon right ti-minus"  style="position: relative;top: 3px;"></div></a><ul catDropdown-target="' + arr[i]["id"] + '" cat-id="' + arr[i]["id"] + '"></ul></li>';
        } else {
            htmlOutput = '<li><a href="#' + arr[i]["en"] + '">' + arr[i]["en"] + "</a></li>";
        }

        if (arr[i]["parent_id"] == 0) {
            output = $("#catList");
        } else {
            output = $('ul[cat-id="' + arr[i]["parent_id"] + '"]');
        }

        $(output).append(htmlOutput);
    }
});

$(document).on("click", "[catDropdown]", function () {
    var targetId = $(this).attr("catDropdown");
    var target = $('ul[catDropdown-target="' + targetId + '"]');

    if ($(this).children(".icon").hasClass("ti-plus")) {
        $(this).children(".icon").removeClass("ti-plus");
        $(this).children(".icon").addClass("ti-minus");
        $(target).removeClass("hidden");
    } else {
        $(this).children(".icon").addClass("ti-plus");
        $(this).children(".icon").removeClass("ti-minus");
        $(target).addClass("hidden");
    }
});

function genData(array) {
    if (currPage > pageCount) currPage = pageCount;
    if (currPage < 1) currPage = 1;

    currlimit = limit * currPage;
    currCount = currlimit - limit;
    if (currlimit > count) currlimit = count;

    var output = "";
    $("#filter1").empty();
    for (var i = 0; i < array.length; i++) {
        var currItem = array[i];
        var img = currItem["img"];
        var name = currItem["name"];
        var price = currItem["price"];
        var optionsTxt = "";

        for (var j in currItem["options"]) {
            for (var k in currItem["options"][j]) {
                var oName = k;
                var oValue = currItem["options"][j][k];
                optionsTxt += " / " + oValue;
            }
        }

        output += '<div class="col-lg-4 col-sm-6"><div class="single_category_product"><div class="single_category_img">' + '<img src="' + img + '" alt="" />' + '<div class="category_social_icon"><ul><li><a href="#"><i class="ti-heart"></i></a></li><li><a href="#"><i class="ti-bag"></i></a></li></ul></div><div class="category_product_text"><a href="single-product.html">' + "<h5>" + currPage + " / " + name + optionsTxt + "</h5></a>" + "<p>" + price + " egp</p></div></div></div></div>";
    }
    currCount = currlimit;
    $("#filter1").append(output);
    /*document.querySelector("#filter1-page").innerHTML = currPage;
    document.querySelector("#filter1-count").innerHTML = array.length;*/
}

function genFlter(list, outId) {
    var output = "";
    $(outId).empty();
    for (var i = 0; i < list.length; i++) {
        var outputChildren = "";
        var name = list[i]["name"];
        var values = list[i]["values"];
        //values = values.sort();
        for (var j = 0; j < values.length; j++) {
            outputChildren += '<li><input type="checkbox" aria-label="Radio button for following text input" name="' + name + '" value="' + values[j] + '"/>' + values[j] + "</li>";
        }
        output += '<ul class="list"><p>' + name + "</p>" + outputChildren + "</ul>";
    }
    $(outId).append(output);
}

/* ================================================================================================== */

// save data in 'userProfile,html'
function saveProfile() {
    "use strict";
    var first_name = document.forms["profile"]["first_name"].value;
    var last_name = document.forms["profile"]["last_name"].value;
    var address = document.forms["profile"]["address"].value;
    var city = document.forms["profile"]["city"].value;
    var email_address = document.forms["profile"]["email_address"].value;
    var password = document.forms["profile"]["password"].value;

    if (first_name != "" && last_name != "" && address != "" && city != "" && email_address != "" && password != "") {
        alert("Successfully, the new data is saved.");
        return true;
    }
}

/* ================================================================================================== */

// save store data in 'storeAdmin.html'
function saveStore() {
    var en_store_name = document.forms["storeDetail"]["en_store_name"].value;
    var ar_store_name = document.forms["storeDetail"]["ar_store_name"].value;
    var store_address = document.forms["storeDetail"]["store_address"].value;
    var store_email = document.forms["storeDetail"]["store_email"].value;
    var store_phone = document.forms["storeDetail"]["store_phone"].value;
    var store_website = document.forms["storeDetail"]["store_website"].value;

    if (en_store_name != "" && ar_store_name != "" && store_address != "" && store_email != "" && store_phone != "" && store_website != "") {
        alert("Successfully, the new data is saved.");
        return true;
    }
}

// save user
function saveStoreUser() {
    "use strict";
    var f_name = document.forms["admin_store_add_user"]["f_name"].value;
    var m_name = document.forms["admin_store_add_user"]["m_name"].value;
    var l_name = document.forms["admin_store_add_user"]["l_name"].value;
    var telephone = document.forms["admin_store_add_user"]["telephone"].value;
    var email = document.forms["admin_store_add_user"]["email"].value;
    var user_type = document.forms["admin_store_add_user"]["user_type"].value;
    var active = document.forms["admin_store_add_user"]["active"].value;
    var pswd = document.forms["admin_store_add_user"]["pswd"].value;

    if (f_name != "" && m_name != "" && l_name != "" && telephone != "" && email != "" && user_type != "" && active != "" && pswd != "") {
        alert("User Saved!");
        return true;
    }
}

// add fields
function add_fields_adm_store_add_user() {
    document.getElementById("admin_add_user").insertRow(-1).innerHTML = '<div class="progress-table-wrap"><div class="progress-table"><div class="table-head"><div class="serial">#</div><div class="country">First Name</div><div class="country">Middle Name</div><div class="country">Last Name</div><div class="country">User Type</div><div class="country">Telephone</div><div class="country">Email</div><div class="country">Password</div><div class="country">Status</div></div><div class="table-row"><div class="serial">#</div><div class="country"><input class="form-control" type="text" id="f_name" name="f_name" placeholder="First Name" required></div><div class="country"><input class="form-control" type="text" id="m_name" name="m_name" placeholder="Middle Name" required></div><div class="country"><input class="form-control" type="text" id="l_name" name="l_name" placeholder="Last Name" required></div><div class="country"><select name="name" id="name" class="custom-select" required><option selected disabled>Choose Here</option><option value="admin">Admin</option><option value="order_manage">Order Management</option><option value="accountant">Accountant</option><option value="sale_store">Store Sale</option><option value="storage">Storage</option></select></div><div class="country"><input class="form-control" type="number" id="telephone" name="telephone" placeholder="Telephone" required></div><div class="country"><input class="form-control" type="email" id="email" name="email" placeholder="Email" required></div><div class="country"><input class="form-control" type="password" id="pswd" name="pswd" placeholder="Passowrd" required></div><div class="country"><select name="active" id="active" class="custom-select" required><option selected disabled>Choose Here</option><option value="active">Active User</option><option value="inactive">Inactive User</option></select></div></div></div></div>';
}

// change user/ customer type
function changeType() {
    alert("You can change type from -Status- field.");
}

/* ================================================================================================== */

// save clients
function saveClient() {
    "use strict";
    var f_name = document.forms["customers_mgmt_add_cust"]["f_name"].value;
    var m_name = document.forms["customers_mgmt_add_cust"]["m_name"].value;
    var l_name = document.forms["customers_mgmt_add_cust"]["l_name"].value;
    var telephone = document.forms["customers_mgmt_add_cust"]["telephone"].value;
    var email = document.forms["customers_mgmt_add_cust"]["email"].value;
    var client_type = document.forms["customers_mgmt_add_cust"]["client_type"].value;
    var active = document.forms["customers_mgmt_add_cust"]["active"].value;
    var pswd = document.forms["customers_mgmt_add_cust"]["pswd"].value;

    if (f_name != "" && m_name != "" && l_name != "" && telephone != "" && email != "" && client_type != "" && active != "" && pswd != "") {
        alert("Client Saved!");
        return true;
    }
}

// add fields for client table
function add_fields_cust_mgmt() {
    document.getElementById("customers_add_cust").insertRow(-1).innerHTML = '<div class="progress-table-wrap"><div class="progress-table"><div class="table-head"><div class="serial">#</div><div class="country">First Name</div><div class="country">Middle Name</div><div class="country">Last Name</div><div class="country">Telephone</div><div class="country">Email</div><div class="country">Type</div><div class="country">Status</div><div class="country">Password</div></div><div class="table-row"><div class="serial">#</div><div class="country"><input class="form-control" type="text" id="f_name" name="f_name" placeholder="First Name" required></div><div class="country"><input class="form-control" type="text" id="m_name" name="m_name" placeholder="Middle Name" required></div><div class="country"><input class="form-control" type="text" id="l_name" name="l_name" placeholder="Last Name" required></div><div class="country"><input class="form-control" type="number" id="telephone" name="telephone" placeholder="Telephone" required></div><div class="country"><input class="form-control" type="email" id="email" name="email" placeholder="Email" required></div><div class="country"><select id="name" name="name" class="custom-select"><option selected disabled>Choose Here</option><option value="online">Online</option><option value="store">Store</option></select></div><div class="country"><select name="active" id="active" class="custom-select"><option selected disabled>Choose Here</option><option value="active">Active Client</option><option value="inactive">Inactive Client</option></select></div><div class="country"><input class="form-control" type="password" id="pswd" name="pswd" placeholder="Passowrd" required></div></div></div></div>';
}

/* ================================================================================================== */

// save org. data in 'org_Detail.html'
function saveOrg() {
    var en_name = document.forms["orgDetail"]["en_name"].value;
    var ar_name = document.forms["orgDetail"]["ar_name"].value;
    var org_address_1 = document.forms["orgDetail"]["org_address_1"].value;
    var org_address_2 = document.forms["orgDetail"]["org_address_2"].value;
    var email = document.forms["orgDetail"]["email"].value;
    var telephone = document.forms["orgDetail"]["telephone"].value;

    if (en_name != "" && ar_name != "" && org_address_1 != "" && org_address_2 != "" && email != "" && telephone != "") {
        alert("Successfully, the new data is saved.");
        return true;
    }
}

// save org. banking information
function saveOrgBanking() {
    "use strict";
    var bank = document.forms["admin_org_add_banking"]["bank"].value;
    var account_number = document.forms["admin_org_add_banking"]["account_number"].value;
    var account_name = document.forms["admin_org_add_banking"]["account_name"].value;
    var bsb = document.forms["admin_org_add_banking"]["bsb"].value;

    if (bank != "" && account_number != "" && account_name != "" && bsb != "") {
        alert("Banking Information Saved!");
        return true;
    }
}

// add fields
function add_fields_adm_org_add_banking() {
    document.getElementById("org_add_banking").insertRow(-1).innerHTML = '<table id="org_add_banking" style="width: 100%;"><div class="progress-table-wrap"><div class="progress-table"><div class="table-head"><div class="serial">#</div><div class="country">Bank Name</div><div class="country">Account Name</div><div class="country">Account Number</div><div class="country">Bank Branch</div><div class="country">Payment Method</div><div class="country">Active Account Banking</div></div><div class="table-row"><div class="serial">#</div><div class="country"><input class="form-control" type="text" id="bank" name="bank" placeholder="Bank Name" required></div><div class="country"><input class="form-control" type="number" id="account_number" name="account_number" placeholder="Account Number" required></div><div class="country"><input class="form-control" type="text" id="account_name" name="account_name" placeholder="Account Name" required></div><div class="country"><input class="form-control" type="text" id="bsb" name="bsb" placeholder="Bank Branch" required></div><div class="country"><input class="form-control" type="text" id="name" name="name" placeholder="Payment Method" required></div><div class="country"><select name="active" id="active" class="custom-select" required><option selected disabled>Choose Here</option><option value="active">Active Account</option><option value="inactive">Inactive Account</option></select></div></div></div></div></table>';
}

// save org user
function saveOrgUser() {
    "use strict";
    var f_name = document.forms["admin_org_add_user"]["f_name"].value;
    var m_name = document.forms["admin_org_add_user"]["m_name"].value;
    var l_name = document.forms["admin_org_add_user"]["l_name"].value;
    var user_type = document.forms["admin_org_add_user"]["user_type"].value;
    var telephone = document.forms["admin_org_add_user"]["telephone"].value;
    var email = document.forms["admin_org_add_user"]["email"].value;
    var pswd = document.forms["admin_org_add_user"]["pswd"].value;
    var active = document.forms["admin_org_add_user"]["active"].value;
    var img = document.forms["admin_org_add_user"]["img"].value;

    if (f_name != "" && m_name != "" && l_name != "" && user_type != "" && telephone != "" && email != "" && pswd != "" && active != "" && img != "") {
        alert("User Saved!");
        return true;
    }
}

// add fields
function add_fields_adm_org_add_user() {
    document.getElementById("org_add_user").insertRow(-1).innerHTML = '<div class="progress-table-wrap"><div class="progress-table"><div class="table-head"><div class="serial">#</div><div class="country">First Name</div><div class="country">Last Name</div><div class="country">User Type</div><div class="country">Telephone</div><div class="country">Email</div><div class="country">Password</div><div class="country">Status</div></div><div class="table-row"><div class="serial">#</div><div class="country"><input class="form-control" type="text" id="org_first_name" name="org_first_name" placeholder="First Name" required></div><div class="country"><input class="form-control" type="text" id="org_last_name" name="org_last_name" placeholder="Last Name" required></div><div class="country"><select name="org_user_type" id="org_user_type" class="custom-select" required><option selected disabled>Choose Here</option><option value="admin">Admin</option><option value="user">User</option></select></div><div class="country"><input class="form-control" type="number" id="org_user_phone" name="org_user_phone" placeholder="Telephone" required></div><div class="country"><input class="form-control" type="email" id="org_user_email" name="org_user_email" placeholder="Email" required></div><div class="country"><input class="form-control" type="password" id="org_user_password" name="org_user_password" placeholder="Passowrd" required></div><div class="country"><select name="org_status" id="org_status" class="custom-select" required><option selected disabled>Choose Here</option><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></div></div></div></div>';
}

/* ================================================================================================== */

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

// Deals with Stock

function newOption() {

}

function categoryOptionData() {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200 && res.type === 'success') {
            var data = '';
            for (var obj of res.data) {
                data += '<option value="' + obj.id + '">' + obj.title_en + " _ " + obj.title_ar + '</option>' + "\n";
            }
            document.querySelectorAll('select[select-options="categories"]').forEach(function (e) {
                e.innerHTML += data;
            });
        } else {
            alert('error');
        }
    }
    xhr.open('GET', eCommerceAPI + '/data/categories?org_id=1');
    xhr.send();
}

function brandOptionData() {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200 && res.type === 'success') {
            var data = '';
            for (var obj of res.data) {
                data += '<option value="' + obj.id + '">' + obj.name_en + " _ " + obj.name_ar + '</option>' + "\n";
            }
            document.querySelectorAll('select[select-options="brands"]').forEach(function (e) {
                e.innerHTML += data;
            });
        } else {
            alert('error');
        }
    }
    xhr.open('GET', eCommerceAPI + '/data/brands?org_id=1');
    xhr.send();
}

function tagOptionData() {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200 && res.type === 'success') {
            var data = '';
            for (var obj of res.data) {
                data += '<option value="' + obj.id + '">' + obj.label_en + " _ " + obj.label_ar + '</option>' + "\n";
            }
            document.querySelectorAll('select[select-options="tags"]').forEach(function (e) {
                e.innerHTML += data;
            });
        } else {
            alert('error');
        }
    }
    xhr.open('GET', eCommerceAPI + '/data/tags?org_id=1');
    xhr.send();
}

var opOptionList;

function opOptionData() {
    if (!opOptionList) {
        var xhr = new XMLHttpRequest();
        xhr.onloadend = function () {
            var res = JSON.parse(xhr.response);
            if (res.status === 200 && res.type === 'success') {
                opOptionList = '';
                for (var obj of res.data) {
                    opOptionList += '<option value="' + obj.id + '">' + obj.title_en + " _ " + obj.title_ar + '</option>' + "\n";
                }
                document.querySelectorAll('#stock_options tr td select[select-options="options"]').forEach(function (e) {
                    e.innerHTML += opOptionList;
                    e.removeAttribute('select-options');
                });
            } else {
                alert('error');
            }
        }
        xhr.open('GET', eCommerceAPI + '/data/options?org_id=1');
        xhr.send();
    } else {
        document.querySelectorAll('#stock_options tr td select[select-options="options"]').forEach(function (e) {
            e.innerHTML += opOptionList;
            e.removeAttribute('select-options');
        });
    }
    return false;
}

categoryOptionData();
brandOptionData();
tagOptionData();
opOptionData();




// addNewStOption
function addNewStock() {
    $("#addStockForrrrm").prepend('<!-- form for whole 2 forms Start --><form id="addStockForrrrm" name="stForm"><h3 class="mb-30">Add New Stock</h3><!-- form for add single stock Start --><div class="p-4 ml-5 mr-5" name="main_stock_data"><div class="row m-0"><div class="form-group p-1 col-sm-6"><label>Product English Name:</label><input type="text" class="form-control" placeholder="Product English Name" name="main_stock_data_title_en"></div><div class="form-group p-1 col-sm-6"><label>Product Arabic Name:</label><input type="text" class="form-control" placeholder="Product Arabic Name" name="main_stock_data_title_ar"></div></div><div class="row m-0"><div class="form-group p-1 col-sm-6"><label>Category:</label><select class="form-control" name="main_stock_data_category" id="stock_category_id" required select-options="categories"><option value="" disabled>Choose Here</option></select></div><div class="form-group p-1 col-sm-6"><label>Brand:</label><select class="form-control" name="main_stock_data_brand" id="stock_brand_id" required select-options="brands"><option value="" disabled>Choose Here</option></select></div></div><div class="form-group"><label>Tags:</label><div class="row"><div class="col-sm"><select id="tagggSelect" class="tag form-control" select-options="tags"><option value="" selected disabled>Choose Here</option></select></div><div class="tag col-sm"><div style="width: 100%; height: 100%;"><input type="text" id="txtValue"><button class="btn btn-danger fa fa-close" onclick="removeTagValue(this);"></button></div></div></div></div><!-- option area start--><div class="form-group"><div class="row"><button type="button" class="btn btn_3" onclick="add_option_new_row();">add options</button></div><table class="table table-striped" id="stock_option_table"><thead><tr><th>Options</th><th>Values</th></tr></thead><tbody id="stock_options"></tbody></table><button type="button" class="btn btn-success btn_3" onclick="saveStockOptionTable();">confirm</button></div><!-- optiono area end--></div><!-- Stock Varients Data Start --><div class="p-4 ml-5 mr-5" name="stock_variants_data"><div name="variant"><div class="row m-0"><div class="form-group p-1 col-sm-6"><label>English Overview:</label><textarea type="text" class="form-control" rows="2" placeholder="English Overview" id="overview_en" name="overview_en"></textarea></div><div class="form-group p-1 col-sm-6"><label>Arabic Overview:</label><textarea type="text" class="form-control" rows="2" placeholder="Arabic Overview" id="overview_ar" name="overview_ar"></textarea></div></div><div class="row m-0"><div class="form-group p-1 col-sm-6"><label>Full English Description:</label><textarea type="text" class="form-control" rows="5" placeholder="Full English Description" id="description_en" name="description_en"></textarea></div><div class="form-group p-1 col-sm-6"><label>Full Arabic Description:</label><textarea type="text" class="form-control" rows="5" placeholder="Full Arabic Description" id="description_ar" name="description_ar"></textarea></div></div><div class="row m-0"><div class="form-group p-1 col-sm-4"><label>SKU:</label><input type="text" class="form-control" placeholder="SKU" id="sku" name="sku"></div><div class="form-group p-1 col-sm-4"><label>Unit Price:</label><input type="text" class="form-control" placeholder="Product Unit Price" id="unit_price" name="unit_price"></div><div class="form-group p-1 col-sm-4"><label>Quantity in Stock:</label><input type="text" class="form-control" placeholder="Quantity in Stock" id="stock" name="stock"></div></div><div class="row m-0"><div class="form-group p-1 col-sm-4"><label>Discount:</label><input type="text" class="form-control" placeholder="Discount" id="discount" name="discount"></div><div class="form-group p-1 col-sm-4"><label>Discount Start:</label><input type="text" class="form-control" placeholder="Discount Start" id="discount_start" name="discount_start"></div><div class="form-group p-1 col-sm-4"><label>Discount End:</label><input type="text" class="form-control" placeholder="Discount End" id="discount_end" name="discount_end"></div></div><div class="row m-0"><div class="form-group p-1 col-sm-3"><label>Package Weight:</label><input type="text" class="form-control" placeholder="Package Weight" id="package_weight" name="package_weight"></div><div class="form-group p-1 col-sm-3"><label>Package Height:</label><input type="text" class="form-control" placeholder="Package Height" id="package_height" name="package_height"></div><div class="form-group p-1 col-sm-3"><label>Package Width:</label><input type="text" class="form-control" placeholder="Package Width" id="package_width" name="package_width"></div><div class="form-group p-1 col-sm-3"><label>Package Length:</label><input type="text" class="form-control" placeholder="Package Length" id="package_length" name="package_length"></div></div><div class="row m-0"><div class="form-group p-1 col-sm-4"><label>Main Image:</label><input type="file" class="form-control-file" accept="image/jpeg,image/png,image/jpg" id="thumbnail" name="thumbnail"></div><div class="form-group p-1 col-sm-8"><label>Another Images:</label><input type="file" class="form-control-file" multiple accept="image/jpeg,image/png,image/jpg" id="stock_detail_images" name="stock_detail_images"></div></div><div class="m-0" name="specs"><div class="row m-0 border mb-3" style="border-width: 3px" name="spec"><div class="col"><label>Icon:</label><select class="form-control" name="variant_spec_icon"></select></div><div class="col"><label>English Title:</label><input type="text" class="form-control" name="variant_spec_title_en"></div><div class="col"><label>English Value:</label><input type="text" class="form-control" name="variant_spec_value_en"></div><div class="col"><label>Arabic Title:</label><input type="text" class="form-control" name="variant_spec_title_ar"></div><div class="col"><label>Arabic Value:</label><input type="text" class="form-control" name="variant_spec_value_ar"></div></div></div></div></div><!-- Stock Varients Data End --><div class="form-group row"><div class="col-sm"><button type="submit" class="btn w-100  btn_3" json-html="">Save Stock</button></div><div class="col-sm"><button type="submit" class="btn w-100  btn_3" json-html="">Delete Stock</button></div></div><!-- form for add single stock --><div class="row m-0"><button type="button" class="btn btn_3 ml-auto" onclick="$(' + '#stockAddOptions' + ').toggle();" json-html="add_options">Add Options</button></div><div id="stockAddOptions" style="display:none;"><!-- form for add stock options Stock Start --><form class="p-4 ml-5 mr-5" id="addStockOptionFrom" name="VarientStockOption"><div class="row"><div class="col-sm"><label>Enter First Option Name</label><input class="form-control" type="text" name="option1" id="option1" required></div><div class="col-sm"><label>Enter First Option Value</label><input class="form-control" type="text" name="rows" id="rows" required></div></div><br><div class="row"><div class="col-sm"><label>Enter Second Option Name</label><input class="form-control" type="text" name="option2" id="option2" required></div><div class="col-sm"><label>Enter Second Option Value</label><input class="form-control" type="text" name="cols" id="cols" required></div></div><br><input class="btn btn_3" name="generate" type="button" value="Create Table!" onclick=' + 'createTable();' + ' /><div id="wrapper"></div></form><!-- form for add stock options Stock End--></div></form><!-- form for whole 2 forms End-->');
}

//output stock 
function postStock() {
    var stock_data = new FormData;

    stock_data.append('org_id', 1);
    stock_data.append('category_id', 1);
    stock_data.append('brand_id', 1);
    stock_data.append('title_en', 1);
    stock_data.append('title_ar', 1);


    stock_data.append('overview_en', 1);
    stock_data.append('overview_ar', 1);
    stock_data.append('description_en', 1);
    stock_data.append('description_ar', 1);
    stock_data.append('sku', 1);
    stock_data.append('unit_price', 1);
    stock_data.append('stock', 1);
    stock_data.append('discount', 1);
    stock_data.append('discount_start', 1);
    stock_data.append('discount_end', 1);
    stock_data.append('package_weight', 1);
    stock_data.append('package_height', 1);
    stock_data.append('package_width', 1);
    stock_data.append('package_length', 1);


    var stock_variant_json = []; // stock details array for variants data to be pushed in
    var image_names = []; // images names to avoid duplicates

    var variants = document.getElementById('wrapper').querySelectorAll('form.variant');

    variants.forEach(function (variant) {
        var variant_data = {
            "name_en": variant.querySelector('[name="name_en"]').value,
            "name_ar": variant.querySelector('[name="name_ar"]').value,
            "overview_en": variant.querySelector('[name="overview_en"]').value,
            "overview_ar": variant.querySelector('[name="overview_ar"]').value,
            "description_en": variant.querySelector('[name="description_en"]').value,
            "description_ar": variant.querySelector('[name="description_ar"]').value,
            "sku": variant.querySelector('[name="sku"]').value,
            "unit_price": variant.querySelector('[name="unit_price"]').value,
            "stock": variant.querySelector('[name="stock"]').value,
            "discount": variant.querySelector('[name="discount"]').value,
            "discount_start": variant.querySelector('[name="discount_start"]').value,
            "discount_end": variant.querySelector('[name="discount_end"]').value,
            "package_weight": variant.querySelector('[name="package_weight"]').value,
            "package_height": variant.querySelector('[name="package_height"]').value,
            "package_width": variant.querySelector('[name="package_width"]').value,
            "package_length": variant.querySelector('[name="package_length"]').value
        }
        variant_data['specs'] = [];
        variant_data['option'] = [];
        variant_data['images'] = [];
        // loop options
        variant.querySelectorAll('[name="option"]').forEach(function (option) {
            option.querySelectorAll('[name="value"]').forEach(function (option_values) {
                variant_data['option'].push(option_values.attr('id'));
            })
        });
        // loop specs
        variant.querySelector('[name="specs"]').querySelectorAll('[name="spec_data"]').forEach(function (spec_data) {
            var spec_json = {
                "title_en/ar": "",
                "icon": "",
                "value_en/ar": ""
            }
            variant_data['specs'].push(spec_json);
        });


        // loop images
        var getImages = variant.querySelector('[name="images"]').files;
        for (var i = 0; i < getImages.length; i++) {
            var imgName = imgAppendName(image_names);
            image_names.push(imgName);
            stock_data.append(imgName, getImages[i]);
            variant_data['images'].push(imgName);
        }

        // main img
        var thumbnail = variant.querySelector('[name="thumbnail"]').files[0];
        var thumbnailName = imgAppendName(image_names);
        image_names.push(thumbnailName);
        stock_data.append(thumbnailName, thumbnail);
        variant_data['thumbnail'] = thumbnailName;


        stock_variant_json.push(variant_data);
    });
    stock_data('detail', JSON.stringify(stock_variant_json));




    console.log(stock_variant_json);









    function imgAppendName(arr) {
        var out = "IMG_" + (Math.floor(Math.random() * 50) + 25).toString();
        if (arr || arr.length > 0) {
            for (var item of arr) {
                if (item === out) imgAppendName(arr);
                else return out;
            }
        } else return out;
    }
}

$("#optionsForm").on("submit", function () {



    function stApi(m, d) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.response);
        }
        xhr.open(m, "http://webdev.exabyte-eg.com/APIs/eCommerce/company/maintenance/stock");
        xhr.send(d);
        getStock();
    }

    return false;
});

/* ===================================================================================================== */

// add parameter in Stock_Detail's URL API
if ($.urlParam('stock')) getStockDetail($.urlParam('stock'));

// get Stock Detail
function getStockDetail(stock_detail_id) {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        var res = JSON.parse(xhr.response);
        if (res.status === 200) {
            putData(res.data[0]);
        } else {
            alert('error');
        }
    }
    xhr.open("GET", "http://webdev.exabyte-eg.com/APIs/eCommerce/access/stock?stock_detail_id=" + stock_detail_id + "&lang=" + getCookie('lang'));
    xhr.send();

    function putData(data) {
        var images = document.getElementById('vertical');
        var prod_name = document.getElementById('prod_name');
        var price = document.getElementById('price');
        var category = document.getElementById('category_name');
        var qty_in_stock = document.getElementById('qty_in_stock');
        var overview = document.getElementById('overview');
        var full_description = document.getElementById('full_description');
        var specs = document.getElementById('specs');
        var reviews = document.getElementById('reviews');
        var options = document.getElementById('options');

        prod_name.innerHTML = data.name;
        data.discount = '.' + (data.discount).replace('.', '0');
        var discPrice = data.unit_price - (data.unit_price * data.discount);
        price.innerHTML = "<i><del>" + data.unit_price + " EGP</del></i>  " + discPrice + " EGP";
        category.innerHTML = data.category_title;
        qty_in_stock.innerHTML = data.stock;
        overview.innerHTML = data.overview;
        full_description.innerHTML = data.description;

        // images
        images.innerHTML = '';
        for (var obj of data.images) {
            var img = eCommerceAPI + obj.image_url;
            images.innerHTML += '<div data-thumb="' + img + '"><img src="' + img + '" alt="' + obj.image_alt + '"/></div>';

        }

        // specs
        specs.innerHTML = '';
        for (var obj of data.specs) {

            specs.innerHTML += '<tbody id=' + specs + '><tr><td><h5><i class="' + obj.icon + '"></i> ' + obj.title + '</h5></td><td><h5>' + obj.value + '</h5></td></tr></tbody>';
        }

        // reviews
        reviews.innerHTML = '';
        for (var obj of data.reviews) {
            var profile_image = eCommerceAPI + "/" + obj.profile_image;
            var rating = Math.floor(obj.rating / 2);
            var stars = '';
            for (var i = 0; i < rating; i++) {
                stars += '<i class="fa fa-star"></i>';
            }

            reviews.innerHTML += '<div class="review_item"><div class="media"><div class="d-flex"><img src="' + eCommerceAPI + profile_image + '" alt="' + obj.client_name + '" /></div><div class="media-body"><h4>' + obj.client_name + '</h4>' + stars + '</div></div><p><h4>Pros</h4>' + obj.pros + '</p><p><h4>Cons</h4>' + obj.cons + '</p><p><h4>Overall</h4>' + obj.overall + '</p></p></div>'
        }

        // options
        options.innerHTML = '';
        for (var obj of data.options) {
            var title = '';
            var values = '';

            for (var obj2 of obj.values) {
                var cssClass = '';
                if (obj2.selected) cssClass = 'active';

                values += '<li><a class="' + cssClass + ' text-center" href="">' + obj2.value + '</a></li>';
            }

            options.innerHTML += '<div class="options" id="options"><ul><span>' + obj.title + ' : </span>' + values + '</ul></div>';
        }

        console.log('done');
    }
}

/* ===================================================================================================== */


/* settingWebsite.html */

// save home page changing
function changeHomePage() {
    var sthome_mainMenu = document.getElementById("sthome_mainMenu");
    var sthome_bannerPart = document.getElementById("sthome_bannerPart");
    var sthome_features = document.getElementById("sthome_features");
    var sthome_bestOffer = document.getElementById("sthome_bestOffer");
    var sthome_shippingDetails = document.getElementById("sthome_shippingDetails");
    var sthome_slideShow = document.getElementById("sthome_slideShow");
    var sthome_instaPhoto = document.getElementById("sthome_instaPhoto");
    var sthome_footer = document.getElementById("sthome_footer");

    if (sthome_mainMenu.checked == true && sthome_bannerPart.checked == true && sthome_features.checked == true && sthome_bestOffer.checked == true && sthome_shippingDetails.checked == true && sthome_slideShow.checked == true && sthome_instaPhoto.checked == true && sthome_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (sthome_mainMenu.checked == false && sthome_bannerPart.checked == false && sthome_features.checked == false && sthome_bestOffer.checked == false && sthome_shippingDetails.checked == false && sthome_slideShow.checked == false && sthome_instaPhoto.checked == false && sthome_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save shop changing
function changeShop() {
    var stshop_mainMenu = document.getElementById("stshop_mainMenu");
    var stshop_breadcrumb = document.getElementById("stshop_breadcrumb");
    var stshop_filtrBrand = document.getElementById("stshop_filtrBrand");
    var stshop_filtrCat = document.getElementById("stshop_filtrCat");
    var stshop_filtrSize = document.getElementById("stshop_filtrSize");
    var stshop_filtrPrice = document.getElementById("stshop_filtrPrice");
    var stshop_slideShow = document.getElementById("stshop_slideShow");
    var stshop_instaPhoto = document.getElementById("stshop_instaPhoto");
    var stshop_footer = document.getElementById("stshop_footer");

    if (stshop_mainMenu.checked == true && stshop_breadcrumb.checked == true && stshop_filtrBrand.checked == true && stshop_filtrCat.checked == true && stshop_filtrSize.checked == true && stshop_filtrPrice.checked == true && stshop_slideShow.checked == true && stshop_instaPhoto.checked == true && stshop_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (stshop_mainMenu.checked == false && stshop_breadcrumb.checked == false && stshop_filtrBrand.checked == false && stshop_filtrCat.checked == false && stshop_filtrSize.checked == false && stshop_filtrPrice.checked == false && stshop_slideShow.checked == false && stshop_instaPhoto.checked == false && stshop_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save client management changing
function changeClientMgmt() {
    var stclient_mainMenu = document.getElementById("stclient_mainMenu");
    var stclient_breadcrumb = document.getElementById("stclient_breadcrumb");
    var stclient_filterClient = document.getElementById("stclient_filterClient");
    var stclient_filterOrders = document.getElementById("stclient_filterOrders");
    var stclient_filterReturnOrder = document.getElementById("stclient_filterReturnOrder");
    var stclient_listOrder = document.getElementById("stclient_listOrder");
    var stclient_listReturnOrder = document.getElementById("stclient_listReturnOrder");
    var stclient_listClientWish = document.getElementById("stclient_listClientWish");
    var stclient_listClientEval = document.getElementById("stclient_listClientEval");
    var stclient_slideShow = document.getElementById("stclient_slideShow");
    var stclient_instaPhoto = document.getElementById("stclient_instaPhoto");
    var stclient_footer = document.getElementById("stclient_footer");

    if (stclient_mainMenu.checked == true && stclient_breadcrumb.checked == true && stclient_filterClient.checked == true && stclient_filterOrders.checked == true && stclient_filterReturnOrder.checked == true && stclient_listOrder.checked == true && stclient_listReturnOrder.checked == true && stclient_listClientWish.checked == true && stclient_listClientEval.checked == true && stclient_slideShow.checked == true && stclient_instaPhoto.checked == true && stclient_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (stclient_mainMenu.checked == false && stclient_breadcrumb.checked == false && stclient_filterClient.checked == false && stclient_filterOrders.checked == false && stclient_filterReturnOrder.checked == false && stclient_listOrder.checked == false && stclient_listReturnOrder.checked == false && stclient_listClientWish.checked == false && stclient_listClientEval.checked == false && stclient_slideShow.checked == false && stclient_instaPhoto.checked == false && stclient_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save single product page
function changeSingleProd() {
    var stsingle_mainMenu = document.getElementById("stsingle_mainMenu");
    var stsingle_breadcrumb = document.getElementById("stsingle_breadcrumb");
    var stsingle_specification = document.getElementById("stsingle_specification");
    var stsingle_comment = document.getElementById("stsingle_comment");
    var stsingle_review = document.getElementById("stsingle_review");
    var stsingle_bestSeller = document.getElementById("stsingle_bestSeller");
    var stsingle_slideShow = document.getElementById("stsingle_slideShow");
    var stsingle_instaPhoto = document.getElementById("stsingle_instaPhoto");
    var stsingle_footer = document.getElementById("stsingle_footer");

    if (stsingle_mainMenu.checked == true && stsingle_breadcrumb.checked == true && stsingle_specification.checked == true && stsingle_comment.checked == true && stsingle_review.checked == true && stsingle_bestSeller.checked == true && stsingle_slideShow.checked == true && stsingle_instaPhoto.checked == true && stsingle_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (stsingle_mainMenu.checked == false && stsingle_breadcrumb.checked == false && stsingle_specification.checked == false && stsingle_comment.checked == false && stsingle_review.checked == false && stsingle_bestSeller.checked == false && stsingle_slideShow.checked == false && stsingle_instaPhoto.checked == false && stsingle_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save organization details page
function changeOrgDetail() {
    var storg_mainMenuod = document.getElementById("storg_mainMenu");
    var storg_breadcrumbod = document.getElementById("storg_breadcrumb");
    var storg_addOrgod = document.getElementById("storg_addOrg");
    var storg_addBankod = document.getElementById("storg_addBank");
    var storg_addUserod = document.getElementById("storg_addUser");
    var storg_slideShowod = document.getElementById("storg_slideShow");
    var storg_instaPhotood = document.getElementById("storg_instaPhoto");
    var storg_footerod = document.getElementById("storg_footer");

    if (storg_mainMenu.checked == true && storg_breadcrumb.checked == true && storg_addOrg.checked == true && storg_addBank.checked == true && storg_addUser.checked == true && storg_slideShow.checked == true && storg_instaPhoto.checked == true && storg_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (storg_mainMenu.checked == false && storg_breadcrumb.checked == false && storg_addOrg.checked == false && storg_addBank.checked == false && storg_addUser.checked == false && storg_slideShow.checked == false && storg_instaPhoto.checked == false && storg_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save store details page
function changeStoreDetails() {
    var ststore_mainMenu = document.getElementById("ststore_mainMenu");
    var ststore_breadcrumb = document.getElementById("ststore_breadcrumb");
    var ststore_addStore = document.getElementById("ststore_addStore");
    var ststore_addUser = document.getElementById("ststore_addUser");
    var ststore_slideShow = document.getElementById("ststore_slideShow");
    var ststore_instaPhoto = document.getElementById("ststore_instaPhoto");
    var ststore_footer = document.getElementById("ststore_footer");

    if (ststore_mainMenu.checked == true && ststore_breadcrumb.checked == true && ststore_addStore.checked == true && ststore_addUser.checked == true && ststore_slideShow.checked == true && ststore_instaPhoto.checked == true && ststore_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (ststore_mainMenu.checked == false && ststore_breadcrumb.checked == false && ststore_addStore.checked == false && ststore_addUser.checked == false && ststore_slideShow.checked == false && ststore_instaPhoto.checked == false && ststore_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

// save add new page
function changeaddNewP() {
    var staddn_mainMenu = document.getElementById("staddn_mainMenu");
    var staddn_breadcrumb = document.getElementById("staddn_breadcrumb");
    var staddn_showBrands = document.getElementById("staddn_showBrands");
    var staddn_addNBrand = document.getElementById("staddn_addNBrand");
    var staddn_showCats = document.getElementById("staddn_showCats");
    var staddn_addNCat = document.getElementById("staddn_addNCat");
    var staddn_showTags = document.getElementById("staddn_showTags");
    var staddn_addNTag = document.getElementById("staddn_addNTag");
    var staddn_slideShow = document.getElementById("staddn_slideShow");
    var staddn_instaPhoto = document.getElementById("staddn_instaPhoto");
    var staddn_footer = document.getElementById("staddn_footer");

    if (staddn_mainMenu.checked == true && staddn_breadcrumb.checked == true && staddn_showBrands.checked == true && staddn_addNBrand.checked == true && staddn_showCats.checked == true && staddn_addNCat.checked == true && staddn_showTags.checked == true && staddn_addNTag.checked == true && staddn_slideShow.checked == true && staddn_instaPhoto.checked == true && staddn_footer.checked == true) {
        alert("Successfully, all checkboxes are checked.");
        return true;
    } else if (staddn_mainMenu.checked == false && staddn_breadcrumb.checked == false && staddn_showBrands.checked == false && staddn_addNBrand.checked == false && staddn_showCats.checked == false && staddn_addNCat.checked == false && staddn_showTags.checked == false && staddn_addNTag.checked == false && staddn_slideShow.checked == false && staddn_instaPhoto.checked == false && staddn_footer.checked == false) {
        alert("You should check at least one of them, it's necessary.");
        return false;
    } else {
        alert("Some checkboxes are not checked, but it's OK.");
        return true;
    }
}

/* ===================================================================================================== */

// Start Survey.jtml
// Question 1
function questOne(){
    var webNeeds1 = document.getElementById("webNeeds1");
    var webNeeds2 = document.getElementById("webNeeds2");
    var webNeeds3 = document.getElementById("webNeeds3");
    var webNeeds4 = document.getElementById("webNeeds4");
    var webNeeds5 = document.getElementById("webNeeds5");

    if (webNeeds1.checked == true || webNeeds2.checked == true || webNeeds3.checked == true || webNeeds4.checked == true || webNeeds5.checked == true) {
        alert("||Let's Go to Next Question!");
        return true;
    } else if (webNeeds1.checked == false || webNeeds2.checked == false || webNeeds3.checked == false || webNeeds4.checked == false || webNeeds5.checked == false) {
        alert("Answer on this Question");
        return false;
    }
}

// Question 2
function questTwo(){
    var timeNeeds1 = document.getElementById("timeNeeds1");
    var timeNeeds2 = document.getElementById("timeNeeds2");
    var timeNeeds3 = document.getElementById("timeNeeds3");
    var timeNeeds4 = document.getElementById("timeNeeds4");
    var timeNeeds5 = document.getElementById("timeNeeds5");

    if (timeNeeds1.checked == true || timeNeeds2.checked == true || timeNeeds3.checked == true || timeNeeds4.checked == true || timeNeeds5.checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else if (timeNeeds1.checked == false || timeNeeds2.checked == false || timeNeeds3.checked == false || timeNeeds4.checked == false || timeNeeds5.checked == false) {
        alert("Answer on this Question");
        return false;
    }
}

// Question 3
function questThree(){
    var takeTime1 = document.getElementById("takeTime1");
    var takeTime2 = document.getElementById("takeTime2");
    var takeTime3 = document.getElementById("takeTime3");
    var takeTime4 = document.getElementById("takeTime4");
    var takeTime5 = document.getElementById("takeTime5");
    var takeTime6 = document.getElementById("takeTime6");

    if (takeTime1.checked == true || takeTime2.checked == true || takeTime3.checked == true || takeTime4.checked == true || takeTime5.checked == true || takeTime6.checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}

// Question 4
function questFour(){
    var attrWeb1 = document.getElementById("attrWeb1");
    var attrWeb2 = document.getElementById("attrWeb2");
    var attrWeb3 = document.getElementById("attrWeb3");
    var attrWeb4 = document.getElementById("attrWeb4");
    var attrWeb5 = document.getElementById("attrWeb5");

    if (attrWeb1.checked == true || attrWeb2.checked == true || attrWeb3.checked == true || attrWeb4.checked == true || attrWeb5.checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}

// Question 5
function questFive(){
    var unStand1 = document.getElementById("unStand1");
    var unStand2 = document.getElementById("unStand2");
    var unStand3 = document.getElementById("unStand3");
    var unStand4 = document.getElementById("unStand4");
    var unStand5 = document.getElementById("unStand5");

    if (unStand1.checked == true || unStand2.checked == true || unStand3.checked == true || unStand4.checked == true || unStand5.checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}

// Question 6
function questSix(){
    var trustW1 = document.getElementById("trustW1");
    var trustW2 = document.getElementById("trustW2");
    var trustW3 = document.getElementById("trustW3");
    var trustW4 = document.getElementById("trustW4");
    var trustW5 = document.getElementById("trustW5");
    var trustW6 = document.getElementById("trustW6");

    if (trustW1.checked == true || trustW2.checked == true || trustW3.checked == true || trustW4.checked == true || trustW5.checked == true|| trustW6.checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}
/*
// Question 7
function questSeven(){
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");

    if (.checked == true || .checked == true || .checked == true || .checked == true || .checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}

// Question 8
function questEight(){
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");
    var  = document.getElementById("");

    if (.checked == true || .checked == true || .checked == true || .checked == true || .checked == true) {
        alert("Let's Go to Next Question!");
        return true;
    } else {
        alert("Answer on this Question");
        return false;
    }
}
*/

/* ===================================================================================================== */

// Deals with Deleted Orders

// Delete New Order
function deleteNewOrder() {
    document.getElementById("new_Order").deleteRow(2);
    alert("You deleted the order!");
}

// Delete Confirm Order
function deleteConfirmOrder() {
    document.getElementById("confirm_Order").deleteRow(2);
    alert("You deleted the order!");
}

// Delete Deliver Order
function deleteDeliverOrder() {
    //document.getElementsByTagName("tr")[2].remove();
    document.getElementById("deliverTable").deleteRow(2);
    alert("You deleted the order!");
}

// Delete Reject Order
function deleteRejectOrder() {
    //document.getElementsByTagName("tr")[2].remove();
    document.getElementById("rejectTable").deleteRow(2);
    alert("You deleted the order!");
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
