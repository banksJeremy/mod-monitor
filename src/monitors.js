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

  [EqualitySet.EQUALS](other) {
    return (
      other instanceof DeletedPost &&
      other.id == this.id &&
      other.utcTime == this.utcTime)
  }

  [EqualitySet.EQUALITY_KEY]() {
    return `${this.utcTime}.${this.id}.DeletedPost`;
  }
}

class DeletionMonitor {
  constructor() {
    this.seenPosts_ = new EqualitySet
  }
  
  getHTML_(url) {
    return fetch (url, {
        credentials: 'include',
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      })
      .then(response => response.text())
      .then(text => (new DOMParser)
          .parseFromString(text, 'text/html'))
  }
  
  getLatest_() {
    throw new Error('should be implemented in subclass');
  }

  getOrCreate_(properties) {
    const created = new DeletedPost(properties)

  }

  getNew() {
    return this.getHTML_(host + paths.recentlyDeleted).then(doc => {
      let rows = Array.from(doc.querySelectorAll('.summary-table tr'))
      let data = rows.map(row => {
        let link = row.querySelector('a');
        let linkMatch = link.getAttribute('href').match(
          /\/questions\/(\d+)(?:[^#]*#(\d+)$)?/);
        if (!linkMatch) throw new Error(`bad link: ${link.outerHTML}`)
        let [, questionIdStr, answerIdStr] = linkMatch;
        return this.getOrCreateDeltedQuestion({
          id: Number(answerIdStr || questionIdStr),
          utcTime: row.querySelector('.relativetime').title,
          isQuestion: link.classList.contains('question-hyperlink'),
          isAnswer: link.classList.contains('answer-hyperlink'),
          title: link.textContent,
        })
      })
      return data
    })
  }
}
