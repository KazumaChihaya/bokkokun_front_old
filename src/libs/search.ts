import { toPhoeticKana, toNarrow } from 'jaco';

export function normalizeWord(word: string): string {
  return toNarrow(toPhoeticKana(word)).toLowerCase();
}

export type AddToken = (token: string) => void;
export type SearchIndexer<T> = (document: T, addToken: AddToken) => void;

export class SearchIndex {
  index = '\0';

  addDocument<T>(key: string, value: T, indexer: SearchIndexer<T>) {
    this.index += key;
    this.index += '\x01';
    const addToken: AddToken = (token) => {
      this.index += normalizeWord(token);
      this.index += '\x02';
    };
    indexer(value, addToken);
    this.index += '\0';
  }

  search(search: string): string[] {
    const found = [] as string[];

    if (search.indexOf('\0') !== -1 || this.index.length === 1) {
      return [];
    }

    let pos = 0;
    while (true) {
      const wordStart = this.index.indexOf(search, pos);
      if (wordStart === -1) break;
      pos = wordStart + 1;

      const keyStart = this.index.lastIndexOf('\0', wordStart);
      const keyEnd = this.index.indexOf('\x01', keyStart);
      const key = this.index.substring(keyStart + 1, keyEnd);
      found.push(key);
    }

    return found;
  }
}
