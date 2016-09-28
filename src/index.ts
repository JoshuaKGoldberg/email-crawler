import { MITSloanCrawler } from "./crawlers/MITSloanCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new MITSloanCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
        });
})();
