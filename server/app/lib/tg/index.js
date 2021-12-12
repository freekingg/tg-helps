import { addExtra } from "puppeteer-extra";
import { Cluster } from "puppeteer-cluster";
import Stealth from "puppeteer-extra-plugin-stealth";
import vanillaPuppeteer from "puppeteer";

import signin from "./signin";
import irrigation from "./task-irrigation";

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(Stealth());

const telegramUrl = 'https://web.telegram.org/k/'

const launchOptions = {
  headless: false,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};

class PuppeteerTelegram {
  constructor(opts = {}) {
    this._opts = opts;
    this._user = null;
  }

  /**
   * Puppeteer Browser instance to use.
   *
   * @return {Promise<Object>}
   */
  async browser() {
    if (!this._browser) {
      const cluster = await Cluster.launch({
        puppeteer,
        maxConcurrency: 2,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        puppeteerOptions: launchOptions,
      });

      this._browser = cluster;
    }

    return this._browser;
  }

  /**
   * Automates the creation of a new Instagram account.
   *
   * @param {object} user - User details for new account
   * @return {Promise}
   */
  static async signin(account) {
    const browser = await vanillaPuppeteer.launch(launchOptions);
    const page = await browser.newPage();
    let authData = await signin(page, {
      url: telegramUrl,
      account,
    });
    browser.close();
    return authData;
  }

  /**
   * 灌水任务
   *
   * @return {Promise}
   */
  async irrigationTask (task) {
    const browser = await this.browser();
    let { accounts } = task
    for (const iterator of accounts) {
      browser.queue({ ...iterator, url: telegramUrl }, irrigation);
    }
    // await browser.idle();
    // await browser.close();
  }

  /**
   * Closes the underlying browser instance, effectively ending this session.
   *
   * @return {Promise}
   */
  async close() {
    const browser = await this.browser();
    await browser.idle();
    await browser.close();

    this._browser = null;
    this._user = null;
  }
}
export default PuppeteerTelegram;
