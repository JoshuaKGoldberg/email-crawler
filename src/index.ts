import { RensselaerPolytechnicInstituteCrawler } from "./crawlers/RensselaerPolytechnicInstituteCrawler";

((): void => {
    const crawler = new RensselaerPolytechnicInstituteCrawler();

    crawler.crawl();
})();