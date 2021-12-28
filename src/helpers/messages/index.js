const getUserbyIDMessage = (str, id) => {
  let arr = str.split("-").map(Number);
  if (arr.indexOf(id) > -1) {
    arr.splice(arr.indexOf(id), 1);
  }

  return arr[0];
};

const makeQueryString = (a) => {
  let str = "select name,surname from users where ";

  for (let ct = 0; ct < a.length; ct++) {
    if (a.length == 1 && ct == 0) {
      str += "id = " + a[ct];
    } else if (ct === a.length - 1) {
      str += "id = " + a[ct];
    } else {
      str += "id = " + a[ct] + " or ";
    }
  }

  return str;
};

module.exports = {
  getUserbyIDMessage,
  makeQueryString,
};
