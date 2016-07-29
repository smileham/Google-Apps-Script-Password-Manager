function checkConfigStatus_() {
  var error = 0;
  
  var theSpreadsheetId = PropertiesService.getScriptProperties().getProperty("SpreadsheetId");
  
  if (!theSpreadsheetId) {
    error = 1;
  }
  
  try {
    var theSpreadsheet = SpreadsheetApp.openById(theSpreadsheetId);
  }
  catch (e) {
    error=error+2;
  }
  
  return error;
}

function createSpreadsheet_() {
  var newSheet = SpreadsheetApp.create("Password Document: "+new Date(), 1, 4);
 
  var thePasswordSheet = newSheet.getSheets()[0].setName("Password");
   var theConfigSheet = newSheet.insertSheet("Config");
  
  var headers = ["Domain", "Username", "Date", "Password"];
  
  thePasswordSheet.getRange("A1:D1").setValues([headers]);
  theConfigSheet.getRange("A1:B2").setValues([["Seed","Password Length"],["Seed","30"]]);
  
  tidySheet(thePasswordSheet);
  tidySheet(theConfigSheet);
  
  return newSheet.getId();
}

function getConfiguration() {
  var theSpreadsheetId = PropertiesService.getScriptProperties().getProperty("SpreadsheetId")
  var theConfigValues = SpreadsheetApp.openById(theSpreadsheetId).getSheetByName("Config").getRange("A2:B2").getValues();
  
  return {"seed":theConfigValues[0][0], "passwordLength":theConfigValues[0][1]};
}

function setConfiguration(config) {
  var theSpreadsheetId = PropertiesService.getScriptProperties().getProperty("SpreadsheetId")
  var theConfigRange = SpreadsheetApp.openById(theSpreadsheetId).getSheetByName("Config").getRange("A2:B2");
  
  theConfigRange.setValues([[config.seed, config.passwordLength]]);
}

function tidySheet(sheet) {
  var maxColumns = sheet.getMaxColumns(); 
  var lastColumn = sheet.getLastColumn();
  if (maxColumns-lastColumn != 0){
    sheet.deleteColumns(lastColumn+1, maxColumns-lastColumn);
  }
  
  var maxRows = sheet.getMaxRows(); 
  var lastRow = sheet.getLastRow();
  if (maxRows-lastRow != 0){
    sheet.deleteRows(lastRow+1, maxRows-lastRow);
  }

}
