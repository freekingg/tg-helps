import { addExtra } from "puppeteer-extra";
import { Cluster } from "puppeteer-cluster";
import Stealth from "puppeteer-extra-plugin-stealth";
import vanillaPuppeteer from "puppeteer";

import signin from './signin'

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(Stealth());

const launchOptions = {
  headless: false
};

class PuppeteerTelegram {
  constructor(opts = {}) {
    this._opts = opts;
    this._user = null;
  }

  /**
   * Whether or not this instance is authenticated with Instagram.
   *
   * @member {boolean}
   */
  get isAuthenticated() {
    return !!this._user;
  }

  /**
   * Authenticated user if authenticated with Instagram.
   *
   * @member {Object}
   */
  get user() {
    return this._user;
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
        maxConcurrency: 1,
        concurrency: Cluster.CONCURRENCY_PAGE,
        puppeteerOptions: launchOptions
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
  async signin(account) {
    const browser = await vanillaPuppeteer.launch(launchOptions)
    const page = await browser.newPage()
    
    await signin(page, {
      url: 'https://web.telegram.org/k/',
      account
    });
  }

  /**
   * Signs out of the currently authenticated Instagram account
   * @return {Promise}
   */
  async signout() {
    const browser = await this.browser();
    await signout(browser, this._user);
    this._user = null;
  }

  /**
   * Closes the underlying browser instance, effectively ending this session.
   *
   * @return {Promise}
   */
  async close() {
    const browser = await this.browser();
    await browser.close();

    this._browser = null;
    this._user = null;
  }
}
export default new PuppeteerTelegram();
