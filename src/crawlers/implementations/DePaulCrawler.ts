import { OrgSyncCrawler } from "./OrgSyncCrawler";

/**
 * Crawls an OrgSync website for organizations.
 */
export class DePaulCrawler extends OrgSyncCrawler {
    /**
     * Initializes a new instance of the DePaulCrawler class.
     */
    constructor() {
        super("DePaul", 413, "zK5JvXS3T8qRn2g0e9VxSH55yBQ9ABSIXGHzPPydxqM");
    }
}
