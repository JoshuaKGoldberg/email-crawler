/// <reference path="../../typings/phantom.d.ts" />

import { Crawler } from "../crawler";
import { PhantomJS, WebPage } from "phantom";

function wait(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve => {
        setTimeout(resolve, milliseconds);
    }));
}

export class RensselaerPolytechnicInstituteCrawler extends Crawler {
    /**
     * 
     */
    public constructor() {
        super(
            {
                name: "Rensselaer Polytechnic Institute",
                clubs: {}
            },
            [
                "http://union.rpi.edu/clubs"
            ]);
    }

    /**
     * 
     */
    protected crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void> {
        console.log("rpi crawling");

        return wait(1000)
            .then(() => webPage.evaluate(function () {
                return document.body.querySelectorAll(".club-box-title-span");
            }))
            .then((stuff): void => {
                console.log("sup", stuff);
            });
        // idea: continuously scroll down until the page height doesn't increase
    }
}