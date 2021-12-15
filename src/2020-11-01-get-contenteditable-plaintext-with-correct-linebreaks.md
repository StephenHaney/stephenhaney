---
title: Get contenteditable plaintext with correct linebreaks
publish_date: 2020-11-01
author: Stephen Haney
---

What do you do if you need plaintext from a `contenteditable` HTML element with correct linebreaks?

It should be simple — just use `element.innerText`

But it turns out that there are bugs with `contenteditable` and `innerText` linebreaks. For me, Chrome reports too many linebreaks. And I’m finding reports of FireFox doing the same

```javascript
// What my content editable looks like, a single line between
a;
// 1
b;

// What Chrome innerText reports, two lines between
a;
// 1
// 2
b;
```

I created a <a href="https://codepen.io/stephenhaney/pen/VwjxeXR">reproduction case codepen</a>, type “a -> return -> return -> b” in the left and you’ll see the wrong result pop up on the right hand side (unless it’s been fixed by now!)

## Why is innerText wrong?

Browsers make up their own HTML for `contenteditable` linebreaks. Some use `div`, some use `p` tags, others prefer `br`. Chrome mixes and matches `divs` and `br` elements.

No wonder `innerText` returns the wrong result — it's hard to parse unpredictable HTML!

Browsers have tried to align on a standard for `contenteditable` HTML . . . my guess is that those efforts broke the `innerText` parsing without anyone noticing.

There's a <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content#Differences_in_markup_generation">great history on MDN</a> if you’d like more info.

## Fixing innerText linebreaks with parsing

What do we do if we need a plaintext value but also need perfect
linebreaks?

Here is a snippet I'm using — it's working but I haven't tested use cases beyond my own. So . . . apply it with your own critical thinking.

```javascript
let newValue = '';
let isOnFreshLine = true;

// Recursive function to navigate childNodes and build linebreaks with text
function parseChildNodesForValueAndLines(childNodes: NodeListOf&lt;ChildNode&gt;) {
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];

    if (childNode.nodeName === 'BR') {
      // BRs are always line breaks which means the next loop is on a fresh line
      newValue += '\n';
      isOnFreshLine = true;
      continue;
    }

    // We may or may not need to create a new line
    if (childNode.nodeName === 'DIV' && isOnFreshLine === false) {
      // Divs create new lines for themselves if they aren't already on one
      newValue += '\n';
    }

    // Whether we created a new line or not, we'll use it for this content so the next loop will not be on a fresh line:
    isOnFreshLine = false;

    // Add the text content if this is a text node:
    if (childNode.nodeType === 3 && childNode.textContent) {
      newValue += childNode.textContent;
    }

    // If this node has children, get into them as well:
    parseChildNodesForValueAndLines(childNode.childNodes);
  }
}

// Parse the child nodes for HTML and newlines:
parseChildNodesForValueAndLines(e.currentTarget.childNodes);

// Do whatever you want with newValue now
```

During testing, I've another found issue in Safari where a single unbreakable word that’s too wide for its element will render with an extra incorrect linebreak – but not when `contenteditable` is set! That’s an issue for another day.

I hope this experience helps someone else who stumbles upon this problem.
