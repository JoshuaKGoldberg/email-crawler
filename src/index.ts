import { RensselaerCrawler } from "./crawlers/RensselaerCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new RensselaerCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", organization);
        });
})();