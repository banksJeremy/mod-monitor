const util = require('./util');


/**
 * A Monitor scrapes a web page for new events, and provides an interface
 * for asynchronously iterating over these events as they are observed.
 * It filters duplicate items as you see them again, too.
 */
class Monitor {  
  constructor() {
    this.chunk_ = [];
    this.minChunkFetchInterval_ = 24 * 1000;
    this.lastChunkFetchTime_ = (+new Date()) - this.minChunkFetchInterval_ * Math.random();
    this.seenItems_ = new Map();
  }

  async next() {
    while (!this.chunk_.length) {
      await this.untilNextFetchTime_();
      this.chunk_ = (await this.getLatest_()).filter(item => {
        const key = item.equalityKey();
        if (this.seenItems_.has(key)) {
          return false;
        } else {
          this.seenItems_.set(key, item);
          return true; 
        }
      })
    }
    return {value: this.chunk_.shift()};
  }

  async getLatest_() {
    throw new Error("must be implemented in subclass");
  }

  async untilNextFetchTime_() {
    for (;;) {
      let durationUntilFetchNextChunk =
          (this.lastChunkFetchTime_ + this.minChunkFetchInterval_) - new Date;
      console.log("Waiting", durationUntilFetchNextChunk, "to reconsider fetching next chunk.")
      if (durationUntilFetchNextChunk <= 0) {
        this.lastChunkFetchTime_ = (+new Date) + this.minChunkFetchInterval_ * (.25 * Math.random());
        break;
      } else {
        await util.sleep(durationUntilFetchNextChunk);
        continue;
      }
    }
  }
  
  async getHTML_(url) {
    const response = await fetch (url, {
      credentials: 'include',
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    });
    const text = await response.text()
    return (new DOMParser).parseFromString(text, 'text/html');
  }
}


/**
 * An equatable item scraped from a page.
 */
class ScrapedItem {
  constructor() {

  }

  equals(other) {
    throw new Error("must be implemented in subclass");
  }

  equalityKey() {
    throw new Error("must be implemented in subclass");
  }
}


module.exports = {
  Monitor,
  ScrapedItem
}
