export async function fetchCssContent(cssUrls) {
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