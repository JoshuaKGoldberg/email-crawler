# Email Crawler

Crawls emails from organization webpages.

## Building

```
npm install -g gulp
npm install
gulp build
```

## Usage

See samples in `src/crawlers/implementations`.

The abstract `Crawler` class manages logic for visiting resources (such as web pages), recording contact info, and adding more resources.
It takes in resources as string URLs, perform some transformation logic on the contents, and supply hooks to deal with the results.
Three abstract implementations exist so far:
* `JsonCrawler`** - Parses the results as JSON.
* `TextCrawler`** - Directly passes the string results.
* `WebPageCrawler`** - Uses Cheerio to parse an HTML web page and passes the Cheerio object.
