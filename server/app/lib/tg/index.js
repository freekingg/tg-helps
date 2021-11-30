import { addExtra } from "puppeteer-extra";
import { Cluster } from "puppeteer-cluster";
import Stealth from "puppeteer-extra-plugin-stealth";
import vanillaPuppeteer from "puppeteer";

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(Stealth());

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
        maxConcurrency: 2,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
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
  async signup(user, opts = {}) {
    const browser = await this.browser();
    await signup(browser, user, opts);
  }

  /**
   * Signs into an existing Instagram account.
   * @param {Object} user - User details for new account
   * @return {Promise}
   */
  async signin(user, opts = {}) {
    const browser = await this.browser();
    await signin(browser, user, opts);
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
export default PuppeteerTelegram;
