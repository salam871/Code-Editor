function run() {
  let htmlcode = document.getElementById("html-area");
  let csscode = document.getElementById("css-area");
  let jscode = document.getElementById("js-area");
  let output = document.getElementById("output");

  output.contentDocument.body.innerHTML =
    htmlcode.value + "<style>" + csscode.value + "</style>";
  output.contentWindow.eval(jscode.value);
}
