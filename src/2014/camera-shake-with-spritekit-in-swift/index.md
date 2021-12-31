---
title: Camera Shake with SpriteKit in Swift
publish_date: 2014-06-30
author: Stephen Haney
tags: SpriteKit, Swift, Camera Shake
---

Camera shake is a super easy, amazingly fun feeling bit of juiciness you can add to your games. It will make events seem more important, and encourage repeated action from the game player. I'd highly encourage game devs to <a href="https://www.youtube.com/watch?v=Fy0aCDmgnxg" target="_blank">watch this YouTube video on the concept of juicy games</a> if you haven't already.

Here's my World class with a basic swift camera shake function. Feel free to play with the intensity and time variables to create different types of shakes.

```swift
class World {
    let canvas = SKSpriteNode();
    var initialPosition:CGPoint?;

    func shakeCamera(duration:Float) {
        let amplitudeX:Float = 10;
        let amplitudeY:Float = 6;
        let numberOfShakes = duration / 0.04;
        var actionsArray:SKAction[] = [];
        for index in 1...Int(numberOfShakes) {
            // build a new random shake and add it to the list
            let moveX = Float(arc4random_uniform(UInt32(amplitudeX))) - amplitudeX / 2;
            let moveY = Float(arc4random_uniform(UInt32(amplitudeY))) - amplitudeY / 2;
            let shakeAction = SKAction.moveByX(moveX, y: moveY, duration: 0.02);
            shakeAction.timingMode = SKActionTimingMode.EaseOut;
            actionsArray.append(shakeAction);
            actionsArray.append(shakeAction.reversedAction());
        }

        let actionSeq = SKAction.sequence(actionsArray);
        canvas.runAction(actionSeq);
    }
}
```

Drop a comment if this helps you or if you have a different or better way of creating camera shake in iOS games.

_Upgraded to play nice with outside SKActions and a few other improvements. Thanks to BenziAhamed and Daniel Griesser in the comments. 7/20/2014_

## Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/5">Discuss this post on GitHub</a>
