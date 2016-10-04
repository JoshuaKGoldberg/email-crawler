/// <reference path="../../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { WebPageCrawler } from "../WebPageCrawler";

/* tslint:disable max-line-length */
/**
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 * SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY SHIRLEY
 */
export class RpiCrawler extends WebPageCrawler {
/* tslint:enable max-line-length */
    /**
     * Headers to be included with all requests.
     */
    private static headers: { [i: string]: string } = {
        /* tslint:disable max-line-length */
        "Proxy-Connection": "keep-alive",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
        "DNT": "1",
        "Referer": "http://union.rpi.edu/clubs",
        "Accept-Language": "en-US,en;q=0.8",
        "Cookie": "SESS8ed91fe39a8892c56f59019169fd317a=7Og-HlFrtrWQGnT3h-VWOwPYim-Fbvh16kovU3AvVy0; __utma=48295269.1695967793.1471831323.1475010460.1475013201.2; __utmz=48295269.1475010460.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __atuvc=5%7C39; has_js=1; _ga=GA1.2.1695967793.1471831323"
        /* tslint:enable max-line-length */
    };

    /**
     * Initializes a new instance of the RpiCrawler class.
     */
    public constructor() {
        super("RPI");

        for (let i: number = 0; i < 15; i += 1) {
            this.addResource({
                callback: this.crawlOrganizationsPage,
                options: {
                    headers: RpiCrawler.headers,
                    url: `http://union.rpi.edu/clubs?page=${i}`,
                },
                url: `http://union.rpi.edu/clubs?page=${i}`
            });
        }
    }

    /**
     * Crawls the page of all organizations.
     */
    private crawlOrganizationsPage($: CheerioStatic): Promise<void> {
        const links: string[] = [];

        $(".view-id-clubs .view-content .views-row .club-box-title-span a")
            .each(function (i: number, rowElement: CheerioElement): void {
                links.push($(this).attr("href"));
            });

        for (const link of links) {
            this.addResource({
                callback: this.crawlOrganizationPage,
                options: {
                    headers: RpiCrawler.headers,
                    url: `http://union.rpi.edu${link}`
                },
                url: `http://union.rpi.edu${link}`
            });
        }

        return Promise.resolve();
    }

    /**
     * Crawls an organization's page.
     */
    private crawlOrganizationPage($: CheerioStatic): Promise<void> {
        const clubTitle: string = $(".club-title").text();
        const officerElement: Cheerio = $(".field-collection-item-field-officers-rcs");
        const officerName: string = officerElement.find(".field-name-field-officer-name").first().text();
        const officerId: string = officerElement.find(".field-name-field-rcs-id").first().text();

        this.addContact(
            clubTitle,
            {
                name: officerName,
                email: `${officerId}@rpi.edu`
            });

        return Promise.resolve();
    }
}
