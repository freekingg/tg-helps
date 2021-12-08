const signin = async (page, url) => {
  await page.setViewport({ width: 1000, height: 937 });
  await page.goto(url);
  await page.waitFor(3000);
  await page.waitForSelector(
    "#auth-pages > .scrollable > .tabs-container > .page-signQR > .container",
    { visible: true }
  );
  await page.screenshot({ path: "screenshot_1.png", fullPage: true });

 

  // 等待扫码登录中
  await page.waitForSelector("#page-chats", { visible: true, timeout: 0 });
  console.log("登录了");

  //  获取 localStorage
  const localStorageData = await page.evaluate(() => {
    let json = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      json[key] = localStorage.getItem(key);
    }
    return json;
  });
  console.log(localStorageData)

  // 获取 cookies
  const cookies = await page.cookies()
  console.log(cookies)

};

export default signin;
