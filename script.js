// Functions for changing the framework as needed
function reactFramework() {
  document.getElementById("html-input").style.display = "none";
  document.getElementById("css-input").style.display = "none";
  document.getElementById("js-input").style.display = "none";
  document.getElementById("react-input").style.display = "inline";
  document.getElementById("react-output").style.display = "inline";
  document.getElementById("output").style.display = "none";
}

function standardFramework() {
  document.getElementById("html-input").style.display = "inline";
  document.getElementById("css-input").style.display = "inline";
  document.getElementById("js-input").style.display = "inline";
  document.getElementById("react-input").style.display = "none";
  document.getElementById("react-output").style.display = "none";
  document.getElementById("output").style.display = "inline";
}

// Monaco loader configuration
require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs" },
});

// Once Monaco editor is loaded, initialize the editors
require(["vs/editor/editor.main"], function () {
  // HTML editor
  var htmlEditor = monaco.editor.create(document.getElementById("html-area"), {
    value: [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      '    <meta charset="UTF-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "    <title>My Web Page</title>",
      "</head>",
      "<body>",
      "    <h1>Hello!</h1>",
      "</body>",
      "</html>",
    ].join("\n"),
    language: "html",
    theme: "vs-dark", // Theme can be 'vs-dark', 'vs', etc.
    automaticLayout: true,
  });

  // CSS editor
  var cssEditor = monaco.editor.create(document.getElementById("css-area"), {
    value: [
      "body {",
      "    font-family: Arial, sans-serif;",
      "    background-color: #f0f0f0;",
      "}",
      "",
      "h1 {",
      "    color: #333;",
      "}",
    ].join("\n"),
    language: "css",
    theme: "vs-dark",
    automaticLayout: true,
  });

  // JavaScript editor
  var jsEditor = monaco.editor.create(document.getElementById("js-area"), {
    value: "",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
  });

  // React Editor
  var reactEditor = monaco.editor.create(
    document.getElementById("react-area"),
    {
      value: `const App = () => <h1>Hello, React!</h1>;`,
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    }
  );

  // Function to update iframe content with the current code
  function updatePreview() {
    var htmlContent = htmlEditor.getValue();
    var cssContent = "<style>" + cssEditor.getValue() + "</style>";
    var jsContent = "<script>" + jsEditor.getValue() + "</script>";

    // Combine HTML, CSS, and JavaScript to create a full document
    var fullContent = htmlContent.replace(
      "</body>",
      cssContent + jsContent + "</body>"
    );

    // Get the iframe document and write the combined content
    var iframe = document.getElementById("output");
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(fullContent);
    iframeDoc.close();
  }

  // Function to handle React JSX transformation and rendering
  function updateReactPreview() {
    var reactCode = reactEditor.getValue();

    // Wrap React code in a simple React app container
    var reactAppCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Preview</title>
          <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone@7.22.9/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${reactCode}
            ReactDOM.render(<App />, document.getElementById('root'));
          </script>
        </body>
      </html>
    `;

    // Get the iframe document and write the React content
    var iframe = document.getElementById("react-output");
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(reactAppCode);
    iframeDoc.close();
  }

  // Update preview on editor content change
  htmlEditor.onDidChangeModelContent(updatePreview);
  cssEditor.onDidChangeModelContent(updatePreview);
  jsEditor.onDidChangeModelContent(updatePreview);
  reactEditor.onDidChangeModelContent(updateReactPreview);

  // Initial preview update
  updatePreview();
  updateReactPreview();
});
