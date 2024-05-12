import juice from 'juice';
import { Buffer } from 'buffer';
import { fetchCssContent } from './comman.js';
import {JSDOM} from 'jsdom';
import fs from 'fs/promises';

const htmlContentParser= (strHtml) => {
  const { window } = new JSDOM(strHtml);
  const domParser = new window.DOMParser();

  const htmlContent = domParser.parseFromString(strHtml, "text/html");
  const head = htmlContent.head;
  const linkElements =  Array.from(head.querySelectorAll('link[rel="stylesheet"]'));
  const cssUrls = linkElements.reduce((acc, link) => {
    const cssUrl = link.href;
    if (cssUrl.includes('css/main') && cssUrl.endsWith('.css')) {
      acc.push(cssUrl);
    }
    return acc;
  }, []);

  const rootElement = htmlContent.getElementsByTagName("body")[0];

  const svgElements = rootElement.getElementsByTagName("svg");
  for (let i = svgElements.length - 1; i >= 0; i--) {
    const svgElement = svgElements[i];
    svgElement.parentNode.removeChild(svgElement);
  }

  const videoElements = rootElement.querySelectorAll('.video-js');
  videoElements.forEach(videoElement => {
    videoElement.remove();
  });

  const divElements = rootElement.querySelectorAll('div');
  for (let i = divElements.length - 1; i >= 0; i--) {
    if (divElements[i].innerHTML.trim() === '') {
      divElements[i].remove();
    }
  }

  const scriptsElements = rootElement.getElementsByTagName('script');
  for (let i = scriptsElements.length - 1; i >= 0; i--) {
    scriptsElements[i].remove();
  }

  const noscripts = rootElement.getElementsByTagName('noscript');
  for (let i = noscripts.length - 1; i >= 0; i--) {
    noscripts[i].remove();
  }

  const elements = rootElement.querySelectorAll('[class*="style_timeline-item-wrapper__"]');
  elements.forEach(function(element) {
    element.remove();
  });
  
  const html = rootElement.innerHTML;
  return {html, cssUrls};
}


export const convertHtmlPageToWordNode = async (htmlContent, fileName) => {
  const htmlObject = htmlContentParser(htmlContent);
  let styleSheets =  await fetchCssContent(htmlObject.cssUrls);
  const htmlWithInlineContent = juice.inlineContent(htmlObject.html, styleSheets);
  const html =`
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <title>Document Title</title>
        <xml>
          <w:worddocument xmlns:w="#unknown">
            <w:view>Print</w:view>
            <w:zoom>90</w:zoom>
            <w:donotoptimizeforbrowser />
          </w:worddocument>
        </xml>
      </head>
      <body>
        <div>
          ${htmlWithInlineContent}
        </div>
      </body>
    </html>
  `
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  const nodeBUffer = Buffer.from(await blob.arrayBuffer());
  await fs.writeFile(fileName, nodeBUffer)
}