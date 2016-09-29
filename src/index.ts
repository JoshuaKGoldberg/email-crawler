import { OhioStateCrawler } from "./crawlers/implementations/OhioStateCrawler";
import { IOrganization } from "./models/IOrganization";
import { CsvOrganizationFormatter } from "./formatters/CsvOrganizationFormatter";

((): void => {
    new OhioStateCrawler()
        .crawl()
        .then((organization: IOrganization): void => {
            console.log("org", JSON.stringify(organization));
            console.log(CsvOrganizationFormatter.OutputGroups(organization));
        });
})();
