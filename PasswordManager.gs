function doGet(e) {
    return HtmlService.createTemplateFromFile('Home').evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle('Password Manager')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function encodeSHA256(text) {
    return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text))
}

function createPassword(domain, username, seed) {
    return encodeSHA256(domain + username + seed).substring(0, PropertiesService.getScriptProperties().getProperty("PasswordLength"))
}

function getScriptUrl() {
    return ScriptApp.getService().getUrl();
}

function getSiteList() {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSheet = thePasswordSheet.getSheetByName("Home Passwords");

    var theValues = theSheet.getRange("A:A").getValues();

    return theValues;
}

function getSiteUserPass(theSiteIndex) {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSheet = thePasswordSheet.getSheetByName("Home Passwords");

    var theValues = theSheet.getRange("C" + theSiteIndex + ":E" + theSiteIndex).getValues();

    return {
        "user": theValues[0][0],
        "pass": theValues[0][2]
    };

}

function insertPassword(theCredentials) {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSeed = thePasswordSheet.getRangeByName("HomeSeed").getValue();
    var theSheet = thePasswordSheet.getSheetByName("Home Passwords");

    var newPassword = createPassword(theCredentials.domain, theCredentials.username, theSeed);

    var reg = /\W/;

    if (newPassword.substring(0, 1).match(reg)) {
        newPassword = "'" + newPassword;
    }

    theSheet.appendRow([theCredentials.domain, "", theCredentials.username, new Date(), newPassword, newPassword, "No"]);

    var thePasswordRange = thePasswordSheet.getRange("A2:G" + theSheet.getMaxRows());
    thePasswordRange.sort(1);
}
