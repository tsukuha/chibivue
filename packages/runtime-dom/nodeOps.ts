import { RendererOptions } from "../runtime-core";

export const nodeOps: Omit<RendererOptions, "patchProp"> = {
  createElement: (tagName: string): Element => {
    return document.createElement(tagName);
  },

  createText: (text: string): Text => {
    return document.createTextNode(text);
  },

  createComment: (text: string): Comment => {
    return document.createComment(text);
  },

  setText: (node, text) => {
    node.nodeValue = text;
  },

  setElementText: (el, text) => {
    el.textContent = text;
  },

  insert: (parentNode: Node, newNode: Node, referenceNode: Node) => {
    parentNode.insertBefore(newNode, referenceNode);
  },

  remove: (node: Node, child: Node) => {
    node.removeChild(child);
  },

  parentNode: (node: Node) => {
    return node.parentNode;
  },

  nextSibling: (node: Node) => {
    return node.nextSibling;
  },
};
