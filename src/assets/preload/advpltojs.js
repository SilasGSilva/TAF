function codeType(codeType, codeContent, objectName) {
  if (codeType == 'setCompany') {
    sessionStorage['TAFCompany'] = codeContent;
  } else if (codeType == 'setContext') {
    var context = JSON.parse(codeContent);
    sessionStorage['TAFContext'] = context.context;
  } else if (codeType == 'setlIsTafFull') {
    var taffull = JSON.parse(codeContent);
    sessionStorage['TAFFull'] = taffull.tafFull;
  } else if (codeType == 'setCodUser') {
    var codUser = JSON.parse(codeContent);
    sessionStorage['TAFUser'] = codUser.codUser;
  } else if (codeType == 'setFeatures') {
    sessionStorage['TAFFeatures'] = codeContent;
  } else if (codeType == 'setTafTsi') {
    var tafTsi = JSON.parse(codeContent);
    sessionStorage['TAFTsi'] = tafTsi.tafTsi;
  } else if (codeType == 'setTafSv') {
    var tafSv = JSON.parse(codeContent);
    sessionStorage['TAFSv'] = tafSv.tafSv;
  }
}
