const logRegLink = $('#log-reg-link');
const logRegForm = $('#log-in-form > form');
const regLink = $('#reg-link');
const logLink = $('#log-link');

regLink.on('click', () => {
    logRegForm.attr('action', '/u/register');
    logRegForm.children().last().html('REGISTER');
    regLink.css('display', 'none');
    logLink.css('display', 'inline');
});

logLink.on('click', () => {
    logRegForm.attr('action', '/u/login');
    logRegForm.children().last().html('LOG IN');
    logLink.css('display', 'none');
    regLink.css('display', 'inline');
});