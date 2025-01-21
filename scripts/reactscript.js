require.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs" },
});

// Once Monaco editor is loaded, initialize the editors
require(["vs/editor/editor.main"], function () {
  // React Editor
  let reactEditor = monaco.editor.create(
    document.getElementById("react-area"),
    {
      value: `
          const { useState } = React;
          function App() {
            const [count, setCount] = useState(0);

            return (
              <div>
                <h1>Counter: {count}</h1>
                <button onClick={() => setCount(count + 1)}>Increment</button>
              </div>
            );
          }

          ReactDOM.render(<App />, document.getElementById('root'));`,
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    }
  );

  function updateReactPreview() {
    let reactCode = reactEditor.getValue();

    try {
      // Transform the React code
      const transformedCode = Babel.transform(
        `
        (function() {
          ${reactCode}
          ReactDOM.render(App(), document.getElementById('root'));
        })();
        `,
        { presets: ["react"] }
      ).code;

      // Wrap the code in an HTML container
      let reactAppCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          
        </head>
        <body>
          <div id="root"></div>
          <script>
            ${transformedCode}
          </script>
        </body>
        </html>
      `;

      // Get the iframe document and write the React content
      let iframe = document.getElementById("output");
      let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      iframeDoc.open(); // Reset the iframe content
      iframeDoc.write(reactAppCode);
      iframeDoc.close();
    } catch (error) {
      console.error("Error updating React preview:", error);
      alert("An error occurred. Check the console for details.");
    }
  }

  document
    .getElementById("run-react")
    .addEventListener("click", updateReactPreview);
});

