import { OrgSyncCrawler } from "./crawlers/implementations/OrgSyncCrawler";
import { IOrganization } from "./models/IOrganization";

((): void => {
    new OrgSyncCrawler("WSU", "https://api.orgsync.com/api/v3/communities/334/portals?key=wI3OYsSEiIuWn5UbKuNKz2LgTLAsbpdIsi9lHGr0R2E&all=true")
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
        });
})();
