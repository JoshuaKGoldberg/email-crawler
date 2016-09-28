/// <reference path="../../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { IContact } from "../../models/IContact";
import { IResourceDescriptor } from "../Crawler";
import { WebPageCrawler } from "../WebPageCrawler";

export class MITSloanCrawler extends WebPageCrawler {
    /**
     * Initializes a new instance of the MITSloanCrawler class.
     */
    public constructor() {
        super("MIT Sloan");

        this.addResource({
            callback: this.crawlOrganizationsPage,
            url: "http://mitsloan.mit.edu/student-life/clubs/"
        });
    }

    /**
     * Crawls the page of all organizations.
     */
    private crawlOrganizationsPage($: CheerioStatic, resource: IResourceDescriptor<CheerioStatic>): Promise<void> {
        const contacts: IContact[] = [];

        $("table.MITTable tr")
            .each(function (i: number, rowElement: CheerioElement): void {
                const cells: Cheerio = $(this).find("td");
                const name: string = cells.first().text();
                const email: string = cells.last().text();

                contacts.push({ name, email });
            });

        for (const contact of contacts) {
            this.addContact(contact.name, contact.email);
        }

        return Promise.resolve();
    }
}
