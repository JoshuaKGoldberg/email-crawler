/// <reference path="../../../node_modules/@types/bluebird/index.d.ts" />
/// <reference path="../../../node_modules/@types/cheerio/index.d.ts" />

import * as Promise from "bluebird";
import "cheerio";

import { IOrganization } from "../../models/IOrganization";
import { IResourceDescriptor } from "../Crawler";
import { JsonCrawler } from "../JsonCrawler";
import { TextCrawler } from "../TextCrawler";

/**
 * An initial response from the OrgSync orgs page.
 */
interface IOrgSyncResponse {
    /**
     * Descriptors of organizations.
     */
    data: IOrgSyncDescriptor[];
}

/**
 * A description of an organization.
 */
interface IOrgSyncDescriptor {
    /**
     * The name of the organization.
     */
    name: string;

    /**
     * Links to organiation resources.
     */
    links: {
        /**
         * The web URL for the organization.
         */
        web: string;
    };
}

/**
 * Crawls an OrgSync website for organizations.
 */
export class OrgSyncCrawler extends JsonCrawler<IOrgSyncResponse> {
    /* tslint:disable max-line-length */
    /**
     * Format string for OrgSync URLs.
     */
    private static orgSyncFormat: string = "https://api.orgsync.com/api/v3/communities/{communityId}/portals?key={key}&all=true";
    /* tslint:enable max-line-length */

    /**
     * Initializes a new instance of the OrgSyncCrawler class.
     * @param name  The name of the association the orgs are under
     * @param communityId   The university's OrgSync community id.
     * @param key   The key in the request.
     */
    public constructor(name: string, communityId: number | string, key: string) {
        super(name);

        this.addResource({
            callback: this.crawlOrganizationsResponse,
            url: OrgSyncCrawler.orgSyncFormat
                .replace("{communityId}", communityId.toString())
                .replace("{key}", key)
        });
    }

    /**
     * Crawls the page of all organizations.
     */
    private crawlOrganizationsResponse(response: IOrgSyncResponse, resource: IResourceDescriptor<IOrgSyncResponse>): Promise<void> {
        const crawls: Promise<void>[] = response.data
            .map((descriptor: IOrgSyncDescriptor): Promise<void> => {
                return new OrgSyncOrganizationCrawler(descriptor.links.web + "/display_profile", descriptor.name)
                    .crawl()
                    .then((results: IOrganization): void => {
                        this.addOrganization(results);
                    });
            });

        return Promise.all(crawls) as Promise<any>;
    }
}

/**
 * Crawls a single organization's API response.
 */
export class OrgSyncOrganizationCrawler extends TextCrawler {
    /**
     * Initializes a new instance of the OrgSyncOrganizationCrawler class.
     * 
     * @param url   The organization's API URL.
     * @param name   The organization's name.
     */
    constructor(url: string, organizationName: string) {
        super(url);

        this.addResource(
            {
                callback: this.crawlOrganizationResponse,
                organization: organizationName,
                options: {
                    headers: {
                        /* tslint:disable max-line-length */
                        "Accept": "*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                        "Accept-Encoding": "gzip, deflate, sdch, br",
                        "Accept-Language": "en-US,en;q=0.8",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                        "Cookie": "my_school=arizona-state-university; __utma=64252785.1797029133.1475088512.1475088512.1475088512.2; __utmb=64252785.8.10.1475088512; __utmc=64252785; __utmz=64252785.1475088512.1.1.utmcsr=asu.orgsync.com|utmccn=(referral)|utmcmd=referral|utmcct=/search; _os_session=230f640f83f11c67a635b4f6ea56188a",
                        "DNT": "1",
                        "Host": "orgsync.com",
                        "Pragma": "no-cache",
                        "Referer": "https://orgsync.com/115401/chapter",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
                        "X-CSRF-Token": "uBqhtROPQhbvP6FuIfvfENU6HcEeB0edeUkOxeGMtU4=",
                        "X-NewRelic-ID": "VgQHVFBACQsHXFZU",
                        "X-Requested-With": "XMLHttpRequest"
                        /* tslint:enable max-line-length */
                    },
                    url
                },
                url
            });
    }

    /**
     * Crawls an organization's API response.
     * 
     * @param text   The response text.
     * @param resource   The requested resource.
     * @returns A Promise for adding the response's contacts.
     */
    private crawlOrganizationResponse(text: string, resource: IResourceDescriptor<string>): Promise<void> {
        const emails: string[] = text.match(/mailto\:.*\"/gi);

        if (!emails) {
            return Promise.resolve();
        }

        const email: string = emails[0]
            .split("\"")[0]
            .replace("mailto:", "")
            .replace("\"", "")
            .replace("\\", "")
            .replace(">", "");

        this.addContact(resource.organization, { email });

        return Promise.resolve();
    }
}
