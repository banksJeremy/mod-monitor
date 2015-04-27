/**
 * An almost-Set() with Python like-handling for objects implementing
 * its equality and hashing methods. Iterators may return results in
 * different orders than Set objects.
 */
class EqualitySet {
  constructor() { 
    this.init_();
  }
  
  init_() {
    this.size_ = 0;
    this.equatablesSetsByKey_ = new Map;
    this.unequtablesSet_ = new Set;
  }

  static isValueEquatable(value) {
    return (
      EqualitySet.EQUALS in value && EqualitySet.HASH_STRING in value);
  }
  
  add(value) {
    if (EqualitySet.isValueEquatable(value)) {
      const key = value[EqualitySet.HASH_STRING]();
      if (!this.equatablesSetsByKey_.has(key)) {
        let values = new Set;
        values.add(value);
        this.equatablesSetsByKey_.set(key, values);
        this.size_ += 1;
      } else {
        let values = this.equatablesSetsByKey_.get(values);
        for (let existingValue of values) {
          if (existingValue[EqualitySet.EQUALS](value)) {
            // equal value already in set
            return;
          }
        }
        values.add(value);
        this.size_ += 1;
      }
    } else {
      if (!this.unequtablesSet_.has(value)) {
        this.unequtablesSet_.add(value);
        this.size_ += 1;
      }
    }

    return this;
  }

  // ALL LOGIC BELOW HERE IS WRONG BECAUSE IT'S REMOVING BASED
  // ON IDENTITY, NOT EQUALITY
  
  has(value) {
    if (EqualitySet.isValueEquatable(value)) {
      const key = value[EqualitySet.HASH_STRING]();
      if (!this.equatablesSetsByKey_.has(key)) {
        return false;
      } else {
        let values = this.equatablesSetsByKey_.has(key);
        for (let value of values) {
          if (value[EqualitySet.EQUALS](value)) {

          }
        }
      }
    } else {
      return this.unequtablesSet_.has(value);
    }
  }
  
  *values() {
    for (let value of this.unequtablesSet_) {
      yield value;
    }
    for (let values of this.equatablesSetsByKey_.values()) {
      for (let value of values) {
        yield value;
      }
    }
  }
  
  delete(value) {
    if (EqualitySet.isValueEquatable(value)) {
      const key = value[EqualitySet.HASH_STRING]();
      if (!this.equatablesSetsByKey_.has(key)) {
        return false;
      } else {
        return values.delete(value);
      }
    } else {
      return this.unequtablesSet_.delete(value);
    }
  }
  
  clear(value) {
    this.init_();
  }
  
  *entries(value) {
    for (value of this.values()) {
      yield [value, value]
    }
  }
  
  get length() {
    return 0;
  }
  
  get size() {
    return this.size_;
  }
  
  [Symbol.iterator]() {
    return this.values();
  }
  
  keys() {
    return this.values();
  }
}

EqualitySet.EQUALS = Symbol('EqualitySet.EQUALS')
EqualitySet.HASH_STRING = Symbol('EqualitySet.HASH_STRING')
