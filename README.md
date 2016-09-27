# Email Crawler

Crawls emails from organization webpages

## Usage

Subclass the `Crawler` class.
Your new class will have to implement the `crawlLandingPage` method, which takes in the Phantom `WebPage` and its URL.

You can use `this.addLandingPage` to add a new page that will be crawled (if it wasn't yet), and `this.addContact` to add new contact information to a group.

For example:

```typescript
import { Crawler } from "Crawler";

class SampleCrawler extends Crawler {
    protected crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void> {
        return webpage.open("www.google.com")
            .then((): void => {
                // ...
            });
    }
}
```

See https://www.npmjs.com/package/phantom