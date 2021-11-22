export default {
  /*解析出htmlEntity &nbsp;等*/
  parse(text) {
    let temp = document.createElement('div');
    temp.innerHTML = text;
    const output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }
};
