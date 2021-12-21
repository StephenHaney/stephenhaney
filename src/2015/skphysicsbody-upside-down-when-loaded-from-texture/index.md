---
title: Upside Down SKPhysicsBody when Loaded From Texture
publish_date: 2015-07-27
author: Stephen Haney
tags: SpriteKit, Swift, Bug
---

I ran into an odd SpriteKit bug the other day when preloading and caching my texture atlases. It seems that you cannot create more than one SKPhysicsBody from a single instance of a texture, or all subsequent physics bodies will be created upside down. <a href="http://stackoverflow.com/questions/27748034/spritekit-skphysicsbody-bodywithtexture-is-upside-down" target="_blank">This StackOverflow thread</a> suggests it's an issue with internally cached textures.

<img src="upside-down-skphysicsbody.png" alt="Building an SKPhysicsBody from a cached texture creates inverted physics bodies" width="623" height="227" />

It may be possible to avoid this by creating a new instance of your texture atlas in memory each time you need to create a physics body from a texture. I don't want to do this, so I decided to draw a path for my penguin's physics body instead:

```swift
let path = CGPathCreateMutable()
CGPathMoveToPoint(path, nil, 12, 21)
CGPathAddLineToPoint(path, nil, -27, -3)
CGPathAddLineToPoint(path, nil, -12, -16)
CGPathAddLineToPoint(path, nil, 24, 8)
CGPathCloseSubpath(path)
self.physicsBody = SKPhysicsBody(polygonFromPath: path)
```

This gives a passable result. It's too bad that the texture based physics body suffers from this bug, since it's otherwise so useful. Perhaps it will be fixed in Swift 2.

<img src="final-body.png" alt="Using a CGPath to create a reasonably accurate physics body" width="365" height="257" />

### Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/3">Discuss this post on GitHub</a>
