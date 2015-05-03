const util = require('./util');


/**
 * A Monitor scrapes a web page for new events, and provides an interface
 * for asynchronously iterating over these events as they are observed.
 */
class Monitor {  
  constructor() {
    this.chunk_ = [];
    this.minChunkFetchInterval_ = 24 * 1000;
    this.lastChunkFetchTime_ = (+new Date) - this.minChunkFetchInterval_ * Math.random();
  }

  async getNextChunk_() {
    throw new Error("must be implemented in subclass");
  }

  async untilNextChunkFetchTime_() {
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

  async next() {
    while (!this.chunk_.length) {
      await this.untilNextChunkFetchTime_();
      this.chunk_ = await this.getNextChunk_();
    }
    return {value: this.chunk_.shift()};
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
 * Monitors posts being deleted.
 */
class DeletedPost {
  constructor({id, utcTime, isQuestion, isAnswer, title}) {
    this.id = id
    this.utcTime = utcTime
    this.isQuestion = isQuestion
    this.isAnswer = isAnswer
    this.title = title
  }

  euqals(other) {
    return (
      other instanceof DeletedPost &&
      other.id == this.id &&
      other.utcTime == this.utcTime)
  }

  equalityKey() {
    return `${this.utcTime}.${this.id}.DeletedPost`;
  }
}

class DeletionMonitor extends Monitor {
  constructor() {
    super();
    
    this.pathToRecentlyDeleted_ =
        '/tools?tab=delete&daterange=last30days&mode=recentlyDeleted';
    this.seenPosts_ = new Map
  }
  
  async getNextChunk_() {
    const latestPosts = await this.getLatest_();
    const newPosts = [];
    for (let post of latestPosts) {
      const key = post.equalityKey();
      if (!this.seenPosts_.has(key)) {
        this.seenPosts_.set(key, post);
        newPosts.unshift(post);
      }
    }

    return newPosts;
  }

  async getLatest_() {
    const doc = await this.getHTML_(this.pathToRecentlyDeleted_);
    const rows = Array.from(doc.querySelectorAll('.summary-table tr'))
    const data = rows.map(row => {
      const link = row.querySelector('a');
      const linkMatch = link.getAttribute('href').match(
        /\/questions\/(\d+)(?:[^#]*#(\d+)$)?/);
      if (!linkMatch) throw new Error(`bad link: ${link.outerHTML}`)
      const [, questionIdStr, answerIdStr] = linkMatch;
      return new DeletedPost({
        id: Number(answerIdStr || questionIdStr),
        utcTime: row.querySelector('.relativetime').title,
        isQuestion: link.classList.contains('question-hyperlink'),
        isAnswer: link.classList.contains('answer-hyperlink'),
        title: link.textContent
      });
    });
    return data;
  }
}

/**
 * Monitors votes to undelete posts.
 */
class UndeletionVoteMonitor extends Monitor {
  // NOT IMPLEMENTED
}

/**
 * Monitors certain flags appearing in the moderator queue.
 */
class ModFlagMonitor extends Monitor {
  // NOT IMPLEMENTED
}

/**
 * Monitors edits to recently-deleted questions, as identified by a
 * DeletionMonitor instance.
 */
class DeletedEditsMonitor extends Monitor {
  constructor(deletionMontior) {
    super();
    this.deletionMontior_ = deletionMontior;
  }
  
  // NOT IMPLEMENTED
}

module.exports = {
  DeletionMonitor,
  UndeletionVoteMonitor,
  ModFlagMonitor,
  DeletedEditsMonitor
};
