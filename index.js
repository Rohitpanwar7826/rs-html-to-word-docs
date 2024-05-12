import juice from 'juice';
import { Buffer } from 'buffer';

const htmlContentParser= (strHtml, env) => {
  let domParser = null;
  if(env === 'nodejs') {
    import('jsdom').then(({ JSDOM }) => {
      const { window } = new JSDOM(strHtml);
      domParser = new window.DOMParser();
    }).catch(err => {
        console.error('Error loading jsdom:', err);
    });
  }else {
    domParser = new window.DOMParser();
  }

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

async function fetchCssContent(cssUrls) {
  let cssContent = "";
  for (let index = 0; index < cssUrls.length; index++) {
    const urlObj = new URL(cssUrls[index]);

    const {username, password, origin, pathname} = urlObj;
    const response = await fetch(origin.concat(pathname), {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    })
    const css = await response.text();
    cssContent += css;
  }
  return cssContent;
}

export const convertHtmlPageToWord = async (htmlContent, env="Javascript") => {
  const htmlObject = htmlContentParser(htmlContent, env);
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
  return env === "nodejs" ? Buffer.from(await blob.arrayBuffer()) : blob;
}