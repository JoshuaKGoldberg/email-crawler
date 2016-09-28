/// <reference path="../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import * as cheerio from "cheerio";

import { Crawler } from "./Crawler";

/**
 * A crawler for web pages.
 */
export abstract class WebPageCrawler extends Crawler<CheerioStatic> {
    /**
     * Loads a web page resource.
     * 
     * @param contents   The contents of the web page.
     * @returns A Promise for the page parsed via Cheerio.
     */
    protected loadResource(contents: string): Promise<CheerioStatic> {
        return Promise.resolve(cheerio.load(contents));
    }
}
