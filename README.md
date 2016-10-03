# Email Crawler

Crawls emails from organization webpages.

## Building

```
npm install -g gulp
npm install
gulp build
```

## Running

```
node lib/index.js
``` 


## Development

For samples, see the files in in `src/crawlers/implementations`.

### `Crawler`

Crawling is done by the abstract `Crawler` class.
It manages logic for visiting resources (such as web pages), recording contact info, and adding more resources.
Crawlers take in resources as string URLs, fetch them using a standard HTTP request, perform some transformation logic on the contents, and supply hooks to deal with the results.

The general practice for `Crawler` is to subclass it with a more specific abstract implementation, whose subclasses have access to `Crawler`'s protected methods.

There are three main abstract implementations of `Crawler`:

* **`JsonCrawler`** - Parses the results as JSON.
* **`TextCrawler`** - Directly passes the string results.
* **`WebPageCrawler`** - Uses Cheerio to parse an HTML web page and passes the Cheerio object.

### `JsonCrawler`

Parses the results as JSON.
The classes are templated across a `TResource`, which is the type of the parsed JSON.
For example:

```typescript
interface ISampleData {
    groupName: string;
    email: string;
    name: string;
}

class SampleJsonCrawler extends JsonCrawler<ISampleData> {
    public constructor() {
        super("Sample");

        this.addResource({
            callback: this.crawlSampleResponse,
            url: "/some/api"
        });
    }

    private crawlSampleResponse(data: ISampleData): Promise<void> {
        this.addContact(
            data.groupName,
            {
                name: data.name,
                email: data.email
            });

        return Promise.resolve();
    }
}
```


### `TextCrawler`

Directly passes the results as a string.

### `WebPageCrawler`

Uses Cheerio to parse an HTML web page and passes the Cheerio object.

```typescript
class SampleWebPageCrawler extends WebPageCrawler {
    public constructor() {
        super("Sample");

        this.addResource({
            callback: this.crawlSampleResponse,
            url: "/smome/page.html"
        });
    }

    private crawlSampleResponse($: CheerioStatic): Promise<void> {
        const groupName: string = $.find(".group").text();
        const contacts: IContact[] = [];

        $(".contact")
            .each(function (): void {
                contacts.push({
                    name: $(this).find(".name").text(),
                    email: $(this).find(".email").text();
                })
            });

        for (const contact of contacts) {
            this.addContact(groupName, contact);
        }

        return Promise.resolve();
    }
}
```
