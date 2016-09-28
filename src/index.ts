import { StRoseCrawler } from "./crawlers/StRoseCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new StRoseCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
        });
})();
