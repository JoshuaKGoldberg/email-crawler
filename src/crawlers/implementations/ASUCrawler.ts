import { OrgSyncCrawler } from "./OrgSyncCrawler";

/**
 * Crawls an OrgSync website for organizations.
 */
export class AsuCrawler extends OrgSyncCrawler {
    /**
     * Initializes a new instance of the AsuCrawler class.
     */
    constructor() {
        super("ASU", 234, "LqnAnR7-T6KLd5iwI9poT4lt91lC_WfdpjPDU5OWzPM&all=true");
    }
}
