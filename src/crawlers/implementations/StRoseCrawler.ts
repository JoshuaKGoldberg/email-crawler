/// <reference path="../../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { IContact } from "../../models/IContact";
import { WebPageCrawler } from "../WebPageCrawler";

export class StRoseCrawler extends WebPageCrawler {
    /**
     * Initializes a new instance of the StRoseCrawler class.
     */
    public constructor() {
        super("MIT Sloan");

        this.addResource({
            callback: this.crawlOrganizationsPage,
            url: "https://www.strose.edu/student-life/leadership-opportunities/student-association/student-association-clubs/",
        });
    }

    /**
     * Crawls the page of all organizations.
     */
    private crawlOrganizationsPage($: CheerioStatic, url: string): Promise<void> {
        const contacts: IContact[] = [];

        $(".typography p")
            .each(function (i: number, rowElement: CheerioElement): void {
                const name: string = $(this).find("strong").text();
                const email: string = $(this).find("a").text();

                contacts.push({ name, email });
            });

        for (const contact of contacts) {
            this.addContact(contact.name, contact.email);
        }

        return Promise.resolve();
    }
}
