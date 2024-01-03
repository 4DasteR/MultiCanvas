var logRegLink = $('#log-reg-link');
var logRegForm = $('#log-in-form > form');
var regLink = $('#reg-link');
var logLink = $('#log-link');
regLink.on('click', function () {
    logRegForm.attr('action', '/u/register');
    logRegForm.children().last().html('REGISTER');
    regLink.css('display', 'none');
    logLink.css('display', 'inline');
});
logLink.on('click', function () {
    logRegForm.attr('action', '/u/login');
    logRegForm.children().last().html('LOG IN');
    logLink.css('display', 'none');
    regLink.css('display', 'inline');
});
