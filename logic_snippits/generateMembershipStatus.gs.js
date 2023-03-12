// This script takes the exported list from mobilepay box. The list contains records of all transactions that has happended in the mobilepay boxes history.
// A record consist of the following rows 
// Datetime, Name, Text, amount (dkk)

// this script should loop through the list with a predefined static year variable. For example the year 2022.
// This means that the script will sort who was active this year, in the respected in the periods.
// During a year there are 2 periods:
// March-August and September-February
// If a record has paid 21 days before a period, then the member becomes active, the coming period. Forexample:
// 20/02/2023 23:48	Shiyu Peng		150
// You can see Shiyu Peng has paid lees that 21 days before the March-August period. Then she should be considered active in the March-August period.
// Therefore she should appear in the `Membership Status March-August ${targetYear}` list.
// If Shiyu Peng had paid 20/01/2023. Then she should not be added anywhere, because, she was paid for last years period.



function generateMembershipStatus() {
  var targetYear = 2022; // Change this to the year you want to target
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var transactionsSheet = ss.getSheetByName('Transactions'); // Change this to the name of the sheet with your data
  var dataRange = transactionsSheet.getDataRange();
  var values = dataRange.getValues();

  // If 'Membership Status March-August' exist then delete it
  if (ss.getSheetByName(`Membership Status March-August ${targetYear}`)) {
    ss.deleteSheet(ss.getSheetByName(`Membership Status March-August ${targetYear}`));
  }

  // If 'Membership Status September-February' exist then delete it
  if (ss.getSheetByName(`Membership Status September-February ${targetYear}`)) {
    ss.deleteSheet(ss.getSheetByName(`Membership Status September-February ${targetYear}`));
  }

  // Create two new sheets for the membership status
  var marchAugustSheet = ss.insertSheet(`Membership Status March-August ${targetYear}`);
  marchAugustSheet.appendRow(['Payment Time', 'Name', 'Text', 'Payed (dkk)', 'Membership Status', 'Comment']);
  var septemberFebruarySheet = ss.insertSheet(`Membership Status September-February ${targetYear}`);
  septemberFebruarySheet.appendRow(['Payment Time', 'Name', 'Text', 'Payed (dkk)', 'Membership Status', 'Comment']);

  // Loop through the rows in your data and add the name and membership status to the new sheet
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var date = new Date(row[0]); // Change this to the column number with the date in your data
    var name = row[1]; // Change this to the column number with the name in your data
    var text = row[2];
    var paymentAmount = row[3]; // Change this to the column number with payment amount in your data
    var comment = `Row added by script, based on data under Transactions`

    // Skip 'Gebyr'
    if (name === 'Gebyr') {
      continue;
    }

    // Determine which period the member is active in and add them to the correct sheet
    if (isMemberActiveInMarchAugust(date, targetYear)) {
      membershipStatus = 'Active';
      marchAugustSheet.appendRow([date, name, text, paymentAmount, membershipStatus, comment]);
    } else if (isMemberActiveInSeptemberFebruary(date, targetYear)) {
      membershipStatus = 'Active';
      septemberFebruarySheet.appendRow([date, name, text, paymentAmount, membershipStatus, comment]);
    }
  }
}

function isMemberActiveInMarchAugust(date, year) {
  var periodStart = new Date(year, 2, 1); // March 1st
  var periodEnd = new Date(year, 7, 31); // August 31st
  
  // Subtract 21 days from the start of the period to get the payment cutoff date
  var paymentCutoff = new Date(periodStart.getTime());
  paymentCutoff.setDate(paymentCutoff.getDate() - 21);
  
  // Check if the member's payment date falls within the active period or 21 days before the start of the period
  return (date >= paymentCutoff && date <= periodEnd);
}

// Helper function to check if a member is active in the September-February period
function isMemberActiveInSeptemberFebruary(date, year) {
  var periodStart = new Date(year, 8, 1); // September 1st of the given year
  var periodEnd = new Date(year + 1, 1, 1); // February 1st of the following year
  var deadline = new Date(periodStart); // Copy the start date
  deadline.setDate(deadline.getDate() - 21); // Subtract 21 days from the start date

  // Check if the payment date is within the active period
  if (date >= deadline && date < periodEnd) {
    return true;
  } else {
    return false;
  }
}

// Helper function to add days to a Date object
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}