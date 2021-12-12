const irrigation = async ({ page, data }) => {
  let { url, authData } = data;
  await page.goto(url);
  await page.waitFor(3000);

  let _authData = JSON.parse(authData);
    let { localStorageData } = _authData;
    console.log('localStorageData: ', localStorageData);

  await page.evaluate(() => {
    let _authData = JSON.parse(authData);
    let { localStorageData } = _authData;
    console.log('localStorageData: ', localStorageData);
    Object.keys(localStorageData).forEach(function (key) {
      localStorage.setItem(key, localStorageData[key]);
    });
    //window.location.reload();
  });
  await page.goto(url);
  console.log("data", data);
  await page.waitFor(30000);

};

export default irrigation;
