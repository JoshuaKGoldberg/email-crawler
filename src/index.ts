import { StonyBrookCrawler } from "./crawlers/StonyBrookCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new StonyBrookCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", organization);
        });
})();