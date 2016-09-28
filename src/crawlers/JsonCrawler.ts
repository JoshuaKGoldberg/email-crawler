/// <reference path="../../node_modules/@types/bluebird/index.d.ts" />

import * as Promise from "bluebird";

import { Crawler } from "./Crawler";

/**
 * A crawler for web pages.
 * 
 * @type TResource   The type of resource data.
 */
export abstract class JsonCrawler<TResource> extends Crawler<TResource> {
    /**
     * Loads a JSON resource.
     * 
     * @param contents   The raw JSON resource.
     * @returns A Promise for the parsed resource.
     */
    protected loadResource(contents: string): Promise<TResource> {
        return Promise.resolve(JSON.parse(contents));
    }
}
