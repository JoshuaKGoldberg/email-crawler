import { ASUCrawler } from "./crawlers/implementations/ASUCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new ASUCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
        });
})();
