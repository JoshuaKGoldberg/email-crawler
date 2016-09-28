import { OhioStateCrawler } from "./crawlers/implementations/OhioStateCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new OhioStateCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
        });
})();
