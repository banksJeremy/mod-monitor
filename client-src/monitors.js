const HOST = 'http://stackoverflow.com';
const PATHS = {
	RECENTLY_DELETED: '/tools?tab=delete&daterange=last30days&mode=recentlyDeleted'
};

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

class DeletionMonitor {
  constructor() {
    this.seenPosts_ = new Map
  }
  
  async getNew() {
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
    const doc = await this.getHTML_(HOST + PATHS.RECENTLY_DELETED);
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
  
  async getHTML_(url) {
    const response = await fetch (url, {
      credentials: 'include',
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    });
    const text = await response.text()
    return (new DOMParser).parseFromString(text, 'text/html');
  }
}

module.exports = {DeletedPost, DeletionMonitor}
