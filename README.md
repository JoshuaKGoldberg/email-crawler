# Email Crawler

Crawls emails from organization webpages.

## Building

```
npm install -g gulp
npm install
gulp build
```

## Usage

Subclass the `Crawler` class.
Your new class will have to implement the `crawlLandingPage` method, which takes in the Phantom `WebPage` and its URL.

Its constructor should call `super` with an `IOrganization` description and initial landing page(s).

You can use `this.addLandingPage` to add a new page that will be crawled (if it wasn't yet), and `this.addContact` to add new contact information to a group.

For example:

```typescript
import { Crawler } from "Crawler";

class SampleCrawler extends Crawler {
    constructor() {
        super(
            "Google",
            [
                "www.google.com/"
            ]);
    }

    protected crawlLandingPage(webPage: WebPage, landingPage: string): Promise<void> {
        // ...will fill out later
    }
}
```

```javascript
new SampleCrawler().crawl()
    .then(organization => console.log("Gog", organization));
```

See https://www.npmjs.com/package/phantom