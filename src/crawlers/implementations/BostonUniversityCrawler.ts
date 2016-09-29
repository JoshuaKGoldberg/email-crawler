import { OrgSyncCrawler } from "./OrgSyncCrawler";

/**
 * Crawls the Boston University OrgSync API for organizations.
 */
export class BostonUniversityCrawler extends OrgSyncCrawler {
    /**
     * Initializes a new instance of the BostonUniversityCrawler class.
     */
    constructor() {
        super("BostonUniversity", 715, "GbKneprNNilSeQHXdFZCIA");
    }
}
