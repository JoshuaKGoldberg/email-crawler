/// <reference path="../../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { IContact } from "../../models/IContact";
import { IResourceDescriptor } from "../Crawler";
import { WebPageCrawler } from "../WebPageCrawler";

export class UclaCrawler extends WebPageCrawler {
    /**
     * Initializes a new instance of the UclaCrawler class.
     */
    public constructor() {
        super("UCLA");

        this.addResource({
            callback: this.crawlOrganizationsPage,
            url: "http://www.studentgroups.ucla.edu/home/clubs/clubslist",
        });
    }

    /**
     * Crawls the page of all organizations.
     */
    private crawlOrganizationsPage($: CheerioStatic, resource: IResourceDescriptor<CheerioStatic>): Promise<void> {
        const contacts: IContact[] = [];

        $("#club-list > li")
            .each(function (i: number, rowElement: CheerioElement): void {
                const name: string = $(this).find("h1").text().trim();
                const email: string = $(this).find(`a[href^="mailto:"]`).text().trim();

                if (name && email) {
                    contacts.push({ name, email });
                }
            });

        for (const contact of contacts) {
            this.addContact(
                contact.name,
                {
                    email: contact.email
                });
        }

        return Promise.resolve();
    }
}
