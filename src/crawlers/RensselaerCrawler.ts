/// <reference path="../../typings/phantom.d.ts" />

import { Crawler } from "../crawler";
import { PhantomJS, WebPage } from "phantom";

export class RensselaerCrawler extends Crawler {
    /**
     * Initializes a new instance of the RensselaerCrawler class.
     */
    public constructor() {
        super(
            "Rensselaer Polytechnic Institute",
            [
                "http://union.rpi.edu/clubs"
            ]);
    }

    /**
     * Crawls an RPI webpage
     */
    protected crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void> {
        // idea: continuously scroll down until the page height doesn't increase
        return Promise.resolve();
    }
}