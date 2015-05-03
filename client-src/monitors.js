const {Monitor, ScrapedItem} = require('./monitor_');



/**
 * Monitors posts being deleted.
 */
class PostDeletionMonitor extends Monitor {
  constructor() {
    super();
    this.path_ =
        '/tools?tab=delete&daterange=last30days&mode=recentlyDeleted';
  }

  async getLatest_() {
    const doc = await this.getHTML_(this.path_);
    const rows = Array.from(doc.querySelectorAll('.summary-table tr'))
    const data = rows.map(row => {
      const link = row.querySelector('a');
      const linkMatch = link.getAttribute('href').match(
        /\/questions\/(\d+)(?:[^#]*#(\d+)$)?/);
      if (!linkMatch) throw new Error(`bad link: ${link.outerHTML}`)
      const [, questionIdStr, answerIdStr] = linkMatch;
      return new PostDeletion({
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
 * The deletion of a post, as scraped from a page.
 */
class PostDeletion extends ScrapedItem {
  constructor({id, utcTime, isQuestion, isAnswer, title}) {
    super();
    this.id = id;
    this.utcTime = utcTime;
    this.isQuestion = isQuestion;
    this.isAnswer = isAnswer;
    this.title = title;
  }

  equals(other) {
    return (
      other instanceof PostDeletion &&
      other.id === this.id &&
      other.utcTime === this.utcTime)
  }

  equalityKey() {
    return `${this.utcTime}.${this.id}.PostDeletion`;
  }
}


/**
 * Monitors votes to undelete posts.
 */
class UndeletionVoteMonitor extends Monitor {
  constructor() {
    super();
    this.path_ =
        '/tools?tab=delete&daterange=last30days&mode=recentUndelete';
  }

  async getLatest_() {
    const doc = await this.getHTML_(this.path_);
    const rows = Array.from(doc.querySelectorAll('.summary-table tr'))
    const data = rows.map(row => {
      const recentVotes = +row.querySelector('.cnt').textContent;
      const remainingVotes = +row.querySelector('span').title.split(' ')[0];
      const link = row.querySelector('a');
      const linkMatch = link.getAttribute('href').match(
        /\/questions\/(\d+)(?:[^#]*#(\d+)$)?/);
      if (!linkMatch) throw new Error(`bad link: ${link.outerHTML}`)
      const [, questionIdStr, answerIdStr] = linkMatch;
      return new UndeletionVote({
        recentVotes,
        remainingVotes,
        id: Number(answerIdStr || questionIdStr),
        isQuestion: link.classList.contains('question-hyperlink'),
        isAnswer: link.classList.contains('answer-hyperlink'),
        title: link.textContent
      });
    });
    return data;
  }
}

class UndeletionVote extends ScrapedItem {
  constructor({id, isQuestion, isAnswer, title, recentVotes, remainingVotes}) {
    super();
    this.id = id;
    this.isQuestion = isQuestion;
    this.isAnswer = isAnswer;
    this.title = title;
    this.recentVotes = recentVotes;
    this.remainingVotes = remainingVotes;
  }

  equals(other) {
    return (
      other instanceof UndeletionVote &&
      other.id === this.id &&
      other.recentVotes === this.recentVotes &&
      other.remainingVotes === this.remainingVotes)
  }

  equalityKey() {
    return `${this.recentVotes}.${this.remainingVotes}.${this.id}.UndeletionVote`;
  }
}


/**
 * Monitors certain flags appearing in the moderator queue.
 */
class ModFlagMonitor extends Monitor {
  // NOT IMPLEMENTED
}

class ModFlag extends ScrapedItem {
  // NOT IMPLEMENTED
}


/**
 * Monitors edits to recently-deleted questions, as identified by a
 * PostDeletionMonitor instance.
 */
class DeletedEditMonitor extends Monitor {
  constructor(deletionMontior) {
    super();
    this.deletionMontior_ = deletionMontior;
  }

  // NOT IMPLEMENTED
}

class DeletedEdit extends ScrapedItem {
  // NOT IMPLEMENTED
}


module.exports = {
  DeletedEditMonitor,
  ModFlagMonitor,
  PostDeletionMonitor,
  UndeletionVoteMonitor
};
