import { chunkArray } from "@/lib/utils";
import { useReducer } from "react";

interface CollectionChunks<T> {
  chunks: Record<number, T[]>;
  current: number;
  found: boolean;
  length: number;
  key: string | number | null;
}

interface NextAction {
  type: "next";
}

interface PrevAction {
  type: "prev";
}

interface UpdateAction<T> {
  type: "update";
  nextItems: T[]; // Now mandatory
}

interface ResetAction {
  type: "reset";
  key: string | number;
}

interface PrependAction<T> {
  type: "prepend";
  item: T;
  size?: number;
}

type Action<T> =
  | NextAction
  | PrevAction
  | UpdateAction<T>
  | ResetAction
  | PrependAction<T>;

function collectionReducer<T>(page: CollectionChunks<T>, action: Action<T>) {
  const { type } = action;
  const newCollection = {
    chunks: { ...page.chunks },
    current: page.current,
    found: page.found,
    length: Object.keys(page.chunks).length,
    key: page.key,
  };

  switch (type) {
    case "next":
      if (page.current + 1 in page.chunks) {
        newCollection.current = page.current + 1;
        newCollection.found = true;

        return newCollection;
      } else {
        newCollection.current = page.current;
        newCollection.found = false;

        return newCollection;
      }
    case "prev":
      if (page.current === 1) {
        newCollection.current = page.current;
        newCollection.found = page.found;

        return newCollection;
      }

      newCollection.current = page.current - 1;
      newCollection.found = page.current - 1 in page.chunks;
      return newCollection;
    case "update":
      if (page.current + 1 in page.chunks) {
        newCollection.current = page.current + 1;
        newCollection.found = true;

        return newCollection;
      }

      newCollection.chunks = action.nextItems
        ? {
            ...page.chunks,
            [page.current + 1]: action.nextItems,
          }
        : { ...page.chunks };
      newCollection.current = page.current + 1;
      newCollection.found = true;
      return newCollection;
    case "prepend":
      newCollection.chunks = chunkArray(
        [action.item, ...Object.values(page.chunks).flat()],
        action?.size || 10
      ).reduce((result: Record<number, T[]>, chunks, index) => {
        result[index + 1] = chunks;
        return result;
      }, {});
      return newCollection;
    case "reset":
      return {
        chunks: {},
        current: 0,
        found: false,
        length: 0,
        key: action.key,
      };
    default:
      return page;
  }
}

export function useCollectionChunks<T>(key: string | number) {
  return useReducer(collectionReducer<T>, {
    chunks: {},
    current: 0,
    found: false,
    length: 0,
    key,
  });
}
