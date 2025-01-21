require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs" },
});

// Once Monaco editor is loaded, initialize the editors
require(["vs/editor/editor.main"], function () {
  // Vue Editor
  const editor = monaco.editor.create(document.getElementById("vue-area"), {
    value: `
      <script>
        let app = Vue.createApp({
          data() {
            return {
              message: "Hello, Vue!"
            };
          }
        });
        app.mount('#app');
      </script>
      `,
    language: "html",
    theme: "vs-dark",
  });

  // Get the iframe document and write the React content
  var iframe = document.getElementById("output");
  var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  document.getElementById("run-vue").addEventListener("click", () => {
    const code = editor.getValue();

    // Parse the Vue code into different parts: template, script, and style
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);
    const styleMatch = code.match(/<style scoped>([\s\S]*?)<\/style>/);

    const template = templateMatch ? templateMatch[1] : "";
    const script = scriptMatch ? scriptMatch[1] : "";
    const style = styleMatch ? styleMatch[1] : "";

    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
        <style>${style}</style>        
      </head>
      <body> 
        <div id="app">${template}
          
        </div>         
        <script>
              ${script}
        </script>        
      </body>
    </html>
  `);
    iframeDoc.close();
  });
});
