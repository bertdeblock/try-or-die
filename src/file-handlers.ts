import { flattenObject } from "flatten-anything";
import set from "lodash.set";
import { FileHandler } from "./types.js";

export function mergeJson(object: any): FileHandler {
  return (content) => {
    const target = JSON.parse(content);
    const objectFlat = flattenObject(object);

    Object.keys(objectFlat).forEach((key) => {
      set(target, key, objectFlat[key]);
    });

    return JSON.stringify(target);
  };
}

export function writeJson(object: any): FileHandler {
  return () => {
    return JSON.stringify(object);
  };
}
