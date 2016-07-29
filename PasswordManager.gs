function doGet(e) {
    if (checkConfigStatus_()>0) {
      PropertiesService.getScriptProperties().setProperty("SpreadsheetId", createSpreadsheet_());
    }
  
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
    var passwordLength = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId")).getSheetByName("Config").getRange("B2").getValue();
    return encodeSHA256(domain + username + seed).substring(0, passwordLength)
}

function getScriptUrl() {
    return ScriptApp.getService().getUrl();
}

function getSiteList() {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSheet = thePasswordSheet.getSheetByName("Passwords");

    var theValues = theSheet.getRange("A:A").getValues();

    return theValues;
}

function getSiteUserPass(theSiteIndex) {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSheet = thePasswordSheet.getSheetByName("Passwords");

    var theValues = theSheet.getRange("B" + theSiteIndex + ":D" + theSiteIndex).getValues();

    return {
        "user": theValues[0][0],
        "pass": theValues[0][2]
    };

}

function removePassword(theSiteIndex) {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
    var theSheet = thePasswordSheet.getSheetByName("Passwords");

    theSheet.deleteRow(theSiteIndex);
  
    return true;
}

function insertPassword(theCredentials) {
    var thePasswordSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SpreadsheetId"));
  var theSeed = thePasswordSheet.getSheetByName("Config").getRange("B1").getValue();
    var theSheet = thePasswordSheet.getSheetByName("Passwords");

    var newPassword = createPassword(theCredentials.domain, theCredentials.username, theSeed);

    var reg = /\W/;

    if (newPassword.substring(0, 1).match(reg)) {
        newPassword = "'" + newPassword;
    }

    theSheet.appendRow([theCredentials.domain, theCredentials.username, new Date(), newPassword]);

    var thePasswordRange = thePasswordSheet.getRange("A2:D" + theSheet.getMaxRows());
    thePasswordRange.sort(1);
}
