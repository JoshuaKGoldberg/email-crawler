import { RensselaerCrawler } from "./crawlers/RensselaerCrawler";

((): void => {
    const crawler = new RensselaerCrawler();

    crawler.crawl();
})();