# HTML to Word Document Converter

## Introduction
The HTML to Word Document Converter is a tool designed to convert HTML content into Microsoft Word (.docx) format. This documentation provides instructions on how to use the converter in various environments such as JavaScript, Node.js, or React.js.

## Features
- Converts HTML content to Microsoft Word (.docx) format.
- Supports basic HTML elements such as text, paragraphs, headings, lists, tables, and images.
- Easy to integrate into different environments.

## Installation

### JavaScript
```javascript
<script type="module">
  import {convertHtmlPageToWordJavascript} from 'https://cdn.jsdelivr.net/npm/html-to-word-convertor@3.0.7/javascript_index.min.js'
  convertHtmlPageToWordJavascript(document.documentElement.innerHTML, 'test.docx')
  </script>
```

### Node.js
```base
	npm install html-to-word-convertor
	
```
```base
	npm add fs
```

```node


import { convertHtmlPageToWordNode } from 'html-to-word-convertor/convertHtmlPageToWordNode'
const  asyncProcessForHtmlParseToDocx = async (htmlContent) => {
  await convertHtmlPageToWordNode(htmlContent, "demo.docx")
}
const htmlContent = `<!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                      </head>
                      <body>
                        <h1 style="color:red;">Hello World Node.js</h1>
                      </body>
                      </html>`
asyncProcessForHtmlParseToDocx(htmlContent)
```

### React js
```base
	npm install html-to-word-convertor
```

```javascript
import { convertHtmlPageToWordJavascript } from 'html-to-word-convertor/convertHtmlPageToWordJavascript';
  const asyncProcessForHtmlParseToDocx = async () => {
    await convertHtmlPageToWordJavascript(document.documentElement.innerHTML, 'demo.docx');
  }
```

### API Reference
convertHtmlPageToWord(htmlContent: string, env: string): Promise<void>
- htmlContent: HTML content string to be converted.
- fileName: File name that you want to save docx ex: test.docx
- Returns: Promise resolving to void.

### Examples
- Basic HTML to Word conversion.
- Conversion with custom styling.
- Conversion with images.

### Contributing
- Contributions to this project are welcome. Feel free to fork the repository, make your changes, and submit a pull request.

### License
This project is licensed under the MIT License.


### Support
For any issues or queries, please contact [rohitpawarmit@gmail.com].



