---
title: React Styled Components in IFrames
publish_date: 2018-07-10
author: Stephen Haney
tags: React, iframe, Styled Components, css-in-js
---

How can you use Styled Components inside an IFrame? It took some research, but I found an elegant solution using <a href="https://github.com/styled-components/styled-components">styled-components</a> and <a href="https://github.com/ryanseddon/react-frame-component">react-frame-component</a>.

Happily, styled-components includes a StyleSheetManager component that can take a target prop. The target expects a DOM node, and it will attach its dynamically created stylesheets to that node.

react-frame-component uses React's context API to expose a `FrameContextProvider`. It includes the IFrame `document` and `window` in the context.

You can combine these two APIs as follows to use styled-components inside your IFrames:

```jsx
<Frame>
  <FrameContextConsumer>
    {(frameContext) => (
      <StyleSheetManager target={frameContext.document.head}>
        <React.Fragment>{/* your children here */}</React.Fragment>
      </StyleSheetManager>
    )}
  </FrameContextConsumer>
</Frame>
```

This works perfectly with react v16.4.1, styled-components v3.3.3, and react-frame-component v4.0.0.

### Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/1">Discuss this post on GitHub</a>
