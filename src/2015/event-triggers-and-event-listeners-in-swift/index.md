---
title: Event Triggers and Event Listeners in Swift, Updated Swift 6.2
author: Stephen Haney
publish_date: 2015-03-05
tags: Swift, Open Source, Events,
---

I recently updated my mini-library that adds Backbone.js style listeners and triggers to Swift. I improved the ability to pass information between triggers and listeners, and updated the syntax for Swift 6.2, using Xcode 6.3 beta 2. Using custom events is a pretty nifty way of organizing your Swift project.

### Download

Download it here: <a href="https://github.com/StephenHaney/Swift-Custom-Events" title="Swift Custom Events on GitHub">Swift Custom Events on GitHub</a>

### Example

Here's an example of how Swift Custom Events works:

Let's create a cat class that can bug us while we're coding:

```swift
class Cat {
    let events = EventManager();

    func meow() {
        println("Cat: MRaawwweeee");
        self.events.trigger("meow", information: "The cat is hungry!");
    }
}
```

And a human class to represent ourselves:

```swift
class Human {
    func adoptCat(cat:Cat) {
        // you can pass in an anonymous code block to the event listener
        cat.events.listenTo("meow", action: {
            println("Human: Awww, what a cute kitty *pets cat*");
        });

        // or you can pass a function reference
        cat.events.listenTo("meow", action: self.dayDream);

        // Using the information from the trigger:
        // (notice the parameters for ponderCat)
        cat.events.listenTo("meow", action: self.ponderCat);
    }

    func dayDream() {
        println("Human daydreams about owning a dog");
    }

    func ponderCat(information:Any?) {
        if let info = information as? String {
            println("Oooh, I think I know:");
            println(info);
        }
    }
}
```

Play out our little scene:

```swift
let zeus = Cat();
let stephen = Human();

stephen.adoptCat(zeus);
zeus.meow();
/*
 * Cat: MRaawwweeee
 * Human: Awww, what a cute kitty *pets cat*
 * Human daydreams about owning a dog
 * Oooh, I think I know:
 * The cat is hungry!
*/
```

Try it out and let me know how it goes: <a href="https://github.com/StephenHaney/Swift-Custom-Events" title="Swift Custom Events on GitHub">Swift Custom Events on GitHub</a>

## Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/4">Discuss this post on GitHub</a>
