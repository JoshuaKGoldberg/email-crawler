/// <reference path="../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { Crawler, ILandingPageCallback } from "../crawler";
// import { IContact } from "../models/IContact";

export class RensselaerCrawler extends Crawler {
    /**
     * Initializes a new instance of the RensselaerCrawler class.
     */
    public constructor() {
        super("Rensselaer Polytechnic Institute");

        this.addLandingPage("http://union.rpi.edu/clubs", this.crawlClubsPage as ILandingPageCallback<this>);
    }

    /**
     * Crawls the Union's listing of all clubs.
     */
    private crawlClubsPage($: CheerioStatic, url: string): Promise<void> {
        $(".club-box-title-span a")
            .each((i: number, element: CheerioElement): void => {
                console.log("Element attribs", element.attribs);
                const clubUrl: string = "http://union.rpi.edu" + element.attribs["href"];

                // this.addLandingPage(clubUrl, this.crawlClubPage as ILandingPageCallback<this>);
            })

        return Promise.resolve();
        // idea: continuously scroll down until the page height doesn't increase
    }

    /**
     * 
     */
    private crawlClubPage($: CheerioStatic, url: string): Promise<void> {
        // const leader: Cheerio = $(".field-name-field-officers-rcs .field-collection-item-field-officers-rcs");

        //         if (!leader) {
        //             return undefined;
        //         }

        //         var name: string = leader.querySelector(".field-name-field-officer-name").textContent;
        //         var email: string = leader.querySelector(".field-name-field-rcs-id") + "@rpi.edu";

        //         return {
        //             name: name,
        //             email: email
        //         };
        //     })
        //     /* tslint:enable */
        //     .then((contact: IContact): void => {
        //         if (contact) {
        //             this.addContact(url, contact);
        //         }
        //     });
        return Promise.resolve();
    }
}