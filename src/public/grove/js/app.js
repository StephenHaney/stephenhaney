!function(){"use strict";window.grove={objectTemplates:[],sounds:[],currentKeyboard:{},lastUpdate:0,worldWidth:0,worldHeight:0,rockSize:70,levels:[],hud:null,hero:null,baddies:[],fireballs:[],structures:[],goals:[],edges:{left:0,right:0,top:0,bottom:0},canvasBack:null,canvasAction:null,canvasFore:null,canvasGui:null,ctxBack:null,ctxAction:null,ctxFore:null,ctxGui:null,paused:!1,initialize:function(){grove.initSounds(),$(function(){$(window).keydown(grove.keyDown),$(window).keyup(grove.keyUp),grove.canvasBack=document.getElementById("canvas-background"),grove.canvasAction=document.getElementById("canvas-action"),grove.canvasFore=document.getElementById("canvas-foreground"),grove.canvasFlying=document.getElementById("canvas-flying"),grove.canvasGui=document.getElementById("canvas-gui"),grove.worldWidth=grove.canvasBack.width,grove.worldHeight=grove.canvasBack.height,grove.ctxBack=grove.canvasBack.getContext("2d"),grove.ctxAction=grove.canvasAction.getContext("2d"),grove.ctxFore=grove.canvasFore.getContext("2d"),grove.ctxFlying=grove.canvasFlying.getContext("2d"),grove.ctxGui=grove.canvasGui.getContext("2d"),grove.scaleCanvasToScreen(),grove.ctxAction.save(),grove.ctxFlying.save(),grove.hero=new grove.objectTemplates.Hero,grove.hud=new grove.objectTemplates.Hud,$("body").waitForImages(function(){grove.changeLevel(0)}),grove.loopy()})},scaleCanvasToScreen:function(){var i=this.worldHeight-$(window).height(),t=this.worldWidth-$(window).width(),e=1,s=1,o=1;i>0&&(e=1-i/this.worldHeight),t>0&&(s=1-t/this.worldWidth),1>e&&s>e?o=e:1>s&&(o=s),tween.set(grove.canvasBack,{scale:o}),tween.set(grove.canvasAction,{scale:o}),tween.set(grove.canvasFore,{scale:o}),tween.set(grove.canvasFlying,{scale:o}),tween.set(grove.canvasGui,{scale:o})},initSounds:function(){grove.sounds.main=new Howl({urls:["sounds/wardens-song.mp3"],loop:!0,volume:.5}),grove.sounds.main.play(),grove.sounds.damage=new Howl({urls:["sounds/hurt.mp3"],volume:.3}),grove.sounds.heal=new Howl({urls:["sounds/heal.mp3"],volume:.2}),grove.sounds.death=new Howl({urls:["sounds/death.mp3"],volume:.4}),grove.sounds.attack=new Howl({urls:["sounds/attack.mp3"],volume:.3}),grove.sounds.transform=new Howl({urls:["sounds/transform.mp3"],volume:.2}),grove.sounds.fireball=new Howl({urls:["sounds/fireball.mp3"],volume:.2})},initImages:function(){for(var i=0;i<this.images.length;i++){var t=new Image;t.src=this.images[i]}},keyDown:function(i){return grove.currentKeyboard[i.keyCode]=!0,49===i.keyCode?void grove.hero.shapeshift("druid"):50===i.keyCode?void grove.hero.shapeshift("wolf"):(51===i.keyCode&&grove.hero.shapeshift("owl"),void(38===i.keyCode||87===i.keyCode?(grove.hero.lastDirection.both=3,grove.hero.lastDirection.y=3):40===i.keyCode||83===i.keyCode?(grove.hero.lastDirection.both=0,grove.hero.lastDirection.y=0):37===i.keyCode||65===i.keyCode?(grove.hero.lastDirection.both=1,grove.hero.lastDirection.x=1):39!==i.keyCode&&68!==i.keyCode||(grove.hero.lastDirection.both=2,grove.hero.lastDirection.x=2)))},keyUp:function(i){grove.currentKeyboard[i.keyCode]=!1},loopy:function(){if(requestAnimationFrame(grove.loopy),!grove.paused){var i=Date.now(),t=i-grove.lastUpdate;grove.lastUpdate=i,t>100&&(t=100),t/=10,grove.updateWorld(t),grove.drawAllTheThings(t)}},updateWorld:function(i){if(!grove.paused){this.hero.update(i);for(var t=0;t<this.baddies.length;t++)this.baddies[t].update(i);for(var e=0;e<this.fireballs.length;e++)this.fireballs[e].update(i);for(var s=0;s<this.goals.length;s++)this.goals[s].update()}},drawAllTheThings:function(i){this.ctxAction.clearRect(0,0,this.worldWidth,this.worldHeight),this.ctxGui.clearRect(0,0,this.hud.size.width,this.hud.size.height),this.hero.flying&&this.clearTheSkies();for(var t=0;t<this.baddies.length;t++)this.baddies[t].draw(i);this.hero.draw(i);for(var e=0;e<this.fireballs.length;e++)this.fireballs[e].draw(i);this.hud.draw()},clearTheSkies:function(){this.ctxFlying.clearRect(0,0,this.worldWidth,this.worldHeight)},changeLevel:function(i){var t=this.levels[i];if("undefined"!=typeof t){this.despawnLevel(),this.edges.left=grove.rockSize-t.edgeAdjustments.left,this.edges.right=grove.worldWidth-grove.rockSize+t.edgeAdjustments.right,this.edges.top=grove.rockSize-t.edgeAdjustments.top,this.edges.bottom=grove.worldHeight-grove.rockSize+t.edgeAdjustments.bottom;var e=new Image;e.src=t.backgroundImageSrc,e.onload=function(){grove.ctxBack.drawImage(e,0,0,1920,1024)};for(var s=0;s<t.goals.length;s++){var o=new grove.objectTemplates.Goal(t.goals[s]);grove.goals.push(o),o.draw(grove.ctxFlying)}for(var h=0;h<t.trees.length;h++){var a=new grove.objectTemplates.Tree(t.trees[h]);grove.structures.push(a);var n=new Image;n.src="img/tree.png",grove.ctxFore.drawImage(n,a.position.x,a.position.y,a.size.width,a.size.height)}for(var r=0;r<t.elementals.length;r++){var l=new grove.objectTemplates.badFireElemental(t.elementals[r]);grove.baddies.push(l)}}},despawnLevel:function(){this.baddies=[],this.structures=[],this.goals=[],grove.ctxBack.clearRect(0,0,grove.canvasBack.width,grove.canvasBack.height),grove.ctxAction.clearRect(0,0,grove.canvasAction.width,grove.canvasAction.height),grove.ctxFore.clearRect(0,0,grove.canvasFore.width,grove.canvasFore.height)},checkForCollision:function(i,t,e){var s;if("undefined"==typeof i.physicsBody?s={x:i.position.x,y:i.position.y,width:i.size.width,height:i.size.height}:(s={x:i.physicsBody.x,y:i.physicsBody.y,width:i.physicsBody.width,height:i.physicsBody.height},s.x+=i.position.x,s.y+=i.position.y),t.position.x<s.x+s.width&&t.position.x+t.size.width>s.x&&t.position.y<s.y+s.height&&t.position.y+t.size.height>s.y){var o=!0;return"undefined"!=typeof e&&(o={x:null,y:null},t.position.x<s.x+s.width&&e.x>=s.x+s.width?o.x=s.x+s.width:t.position.x+t.size.width>s.x&&e.x+t.size.width<=s.x?o.x=s.x-t.size.width:t.position.y<s.y+s.height&&e.y>=s.y+s.height?o.y=s.y+s.height:t.position.y+t.size.height>s.y&&e.y+t.size.height<=s.y&&(o.y=s.y-t.size.height)),o}return!1}},grove.initialize()}(),function(){"use strict";grove.objectTemplates.Hero=function(){this.initialLife=100,this.life=this.initialLife-30,this.displayLife=this.life,this.speed=3.65,this.attackDamage=10,this.initialSize={width:64,height:64},this.size={width:this.initialSize.width,height:this.initialSize.height},this.origin={x:this.size.width/2,y:this.size.height/2},this.initialPosition={x:928,y:300},this.position=this.initialPosition,this.currentFormName="druid",this.forms={druid:{size:{width:64,height:64},animationFrameCount:2,millisecondsPerFrame:13,speed:3.65,imageIndex:0,abilityDelay:1e3,alwaysAnimating:!1,flying:!1},wolf:{size:{width:100,height:100},animationFrameCount:7,millisecondsPerFrame:5,speed:5,imageIndex:1,abilityDelay:600,alwaysAnimating:!1,flying:!1},owl:{size:{width:80,height:80},animationFrameCount:2,millisecondsPerFrame:10,speed:6,imageIndex:2,abilityDelay:5e3,alwaysAnimating:!0,flying:!0}},this.imageIndex=0,this.images=[new Image,new Image,new Image],this.images[0].src="img/hero.png",this.images[1].src="img/hero-wolf.png",this.images[2].src="img/hero-owl.png",this.healing=!1,this.attacking={animating:!1},this.attackBox=null,this.attackAnimationSpeed=275,this.attackImage=new Image,this.attackImage.src="img/claw-attack.png",this.attackImage.size={vertical:{width:133,height:43},horizontal:{width:43,height:133}},this.attackImage.origin={vertical:{x:this.attackImage.size.vertical.width/2,y:this.attackImage.size.vertical.height/2},horizontal:{x:this.attackImage.size.horizontal.width/2,y:this.attackImage.size.horizontal.height/2}},this.attackImage.offsets={top:{x:0,y:0},bottom:{x:0,y:43},left:{x:133,y:0},right:{x:176,y:0}},this.lastDirection={x:1,y:0,both:0},this.animationDirection=0,this.alwaysAnimating=!1,this.millisecondsPerFrame=this.forms.druid.millisecondsPerFrame,this.animationFrameCount=this.forms.druid.animationFrameCount,this.animationFrame=0,this.timeSinceLastAnimation=0,this.abilityDelay=this.forms.druid.abilityDelay,this.lastAbility=0,this.lastDamageTaken=0,this.opacity=1,this.flying=!1,this.shapeshift=function(i){this.animationFrame=0,this.timeSinceLastAnimation=0;var t;"druid"===i?t=this.forms.druid:"wolf"===i?t=this.forms.wolf:"owl"===i&&(t=this.forms.owl),grove.sounds.transform.play(),grove.clearTheSkies(),this.currentFormName=i,this.size=t.size,this.origin={x:this.size.width/2,y:this.size.height/2},this.animationFrameCount=t.animationFrameCount,this.millisecondsPerFrame=t.millisecondsPerFrame,this.imageIndex=t.imageIndex,this.speed=t.speed,this.abilityDelay=t.abilityDelay,this.alwaysAnimating=t.alwaysAnimating,this.flying=t.flying,this.lastAbility=0,grove.hud.switchForm(i)},this.ability=function(){var i=Date.now();i>this.lastAbility+this.abilityDelay&&(this.lastAbility=i,"druid"===this.currentFormName?this.cast("heal"):"wolf"===this.currentFormName&&this.cast("attack"))},this.cast=function(i){"heal"===i&&this.healing===!1?(grove.sounds.heal.play(),this.healing=!0,tween.to({},5,{overwrite:"none",onUpdate:_.bind(this.healOverTimeTick,this),onComplete:function(){grove.hero.healing=!1}})):"attack"===i&&(grove.sounds.attack.play(),this.attacking.animating=!0,this.attacking.direction=this.lastDirection.both,setTimeout(function(){grove.hero.attacking.animating=!1,grove.hero.attackBox=null},this.attackAnimationSpeed))},this.healOverTimeTick=function(){this.life+=.00175*this.initialLife,this.life>this.initialLife&&(this.life=this.initialLife),tween.to(this,.3,{displayLife:this.life})},this.damage=function(i){var t=Date.now();if(t>this.lastDamageTaken+1200){if(this.lastDamageTaken=t,this.life-=i,tween.to(this,.3,{displayLife:this.life}),this.life<=0)return grove.sounds.death.play(),this.opacity=.3,this.displayLife=0,void(grove.paused=!0);grove.sounds.damage.play(),this.damageAnimation()}},this.damageAnimation=function(){tween.to(grove.hero,.3,{opacity:0,overwrite:"none",onComplete:function(){tween.to(grove.hero,.3,{opacity:1,overwrite:"none",onComplete:function(){tween.to(grove.hero,.3,{opacity:0,overwrite:"none",onComplete:function(){tween.to(grove.hero,.3,{opacity:1})}})}})}})},this.draw=function(i){var t=this.animationDirection*this.size.height,e=this.animationFrame*this.size.width,s=grove.ctxAction;this.flying&&(s=grove.ctxFlying),1!==this.opacity?(s.globalAlpha=this.opacity,s.drawImage(this.images[this.imageIndex],e,t,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width,this.size.width),s.globalAlpha=1):s.drawImage(this.images[this.imageIndex],e,t,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width,this.size.width),this.attacking.animating&&this.drawAttack(s)},this.update=function(i){var t={x:0,y:0},e=!1;if(grove.currentKeyboard[32]===!0&&this.ability(),null!==this.attackBox)for(var s=0;s<grove.baddies.length;s++)if(!(grove.baddies[s].health<=0)){var o=grove.checkForCollision(grove.baddies[s],this.attackBox);o&&grove.baddies[s].takeDamage(grove.hero.attackDamage)}var h=grove.currentKeyboard[38]===!0||grove.currentKeyboard[87]===!0,a=grove.currentKeyboard[40]===!0||grove.currentKeyboard[83]===!0,n=grove.currentKeyboard[37]===!0||grove.currentKeyboard[65]===!0,r=grove.currentKeyboard[39]===!0||grove.currentKeyboard[68]===!0;if(h&&0!==this.lastDirection.y&&(t.y=-1,this.animationDirection=3),a&&3!==this.lastDirection.y&&(t.y=1,this.animationDirection=0),n&&2!==this.lastDirection.x?(t.x=-1,this.animationDirection=1):r&&1!==this.lastDirection.x&&(t.x=1,this.animationDirection=2),(0!==t.x||0!==t.y)&&!grove.paused){var l=Math.sqrt(t.x*t.x+t.y*t.y);e=!0;var g={position:{x:this.position.x,y:this.position.y},size:{width:this.size.width,height:this.size.height}};if(0!==t.x&&(t.x/=l,g.position.x+=t.x*this.speed*i),0!==t.y&&(t.y/=l,g.position.y+=t.y*this.speed*i),this.flying===!1)for(var d=0;d<grove.structures.length;d++){var c=grove.checkForCollision(grove.structures[d],g,this.position);c&&(null!==c.x?g.position.x=c.x:null!==c.y&&(g.position.y=c.y))}this.position=g.position;var y=this.position.y+this.size.height,m=this.position.x+this.size.width;this.position.x<grove.edges.left?this.position.x=grove.edges.left:m>grove.edges.right&&(this.position.x=grove.edges.right-this.size.width),this.position.y<grove.edges.top?this.position.y=grove.edges.top:y>grove.edges.bottom&&(this.position.y=grove.edges.bottom-this.size.height)}e||this.alwaysAnimating?(this.timeSinceLastAnimation+=i,this.timeSinceLastAnimation>this.millisecondsPerFrame&&(this.timeSinceLastAnimation=0,this.animationFrame++,this.animationFrame>this.animationFrameCount&&(this.animationFrame=0))):this.animationFrame=0},this.drawAttack=function(i){var t={x:0,y:0},e={x:0,y:0},s={width:0,height:0},o=Date.now(),h=(o-this.lastAbility)/this.attackAnimationSpeed;i.save();var a={x:this.position.x+this.origin.x,y:this.position.y+this.origin.y};i.translate(a.x,a.y),3===this.attacking.direction?(i.rotate(1.9*h-1.5),t={x:-75,y:-100},e={x:this.attackImage.offsets.top.x,y:this.attackImage.offsets.top.y},s={width:this.attackImage.size.vertical.width,height:this.attackImage.size.vertical.height}):0===this.attacking.direction?(i.rotate(-1.8*h+1.34),t={x:-75,y:60},e={x:this.attackImage.offsets.bottom.x,y:this.attackImage.offsets.bottom.y},s={width:this.attackImage.size.vertical.width,height:this.attackImage.size.vertical.height}):1===this.attacking.direction?(i.rotate(-2.1*h+1.7),t={x:-105,y:-70},e={x:this.attackImage.offsets.left.x,y:this.attackImage.offsets.left.y},s={width:this.attackImage.size.horizontal.width,height:this.attackImage.size.horizontal.height}):2===this.attacking.direction&&(i.rotate(1.8*h-1.2),t={x:70,y:-70},e={x:this.attackImage.offsets.right.x,y:this.attackImage.offsets.right.y},s={width:this.attackImage.size.horizontal.width,height:this.attackImage.size.horizontal.height}),s.width*=h,s.height*=h,i.drawImage(this.attackImage,e.x,e.y,s.width,s.height,t.x,t.y,s.width,s.height),i.restore(),this.attackBox={position:{x:a.x+t.x,y:a.y+t.y},size:{width:2*s.width,height:2*s.height}}}}}(),function(){"use strict";grove.objectTemplates.Tree=function(i){this.size={width:206,height:214},this.position={x:0,y:0},this.physicsBody={x:85,y:172,width:31,height:38},"undefined"!=typeof i&&("undefined"!=typeof i.width&&(this.size.width=i.width),"undefined"!=typeof i.height&&(this.size.height=i.height),"undefined"!=typeof i.x&&(this.position.x=i.x),"undefined"!=typeof i.y&&(this.position.y=i.y))},grove.objectTemplates.Goal=function(i){this.position={x:0,y:0},this.playerPosition={x:500,y:500},this.size={width:0,height:0},this.collide=!1,this.levelIndex=0,this.collide=!0,"undefined"!=typeof i&&("undefined"!=typeof i.width&&(this.size.width=i.width),"undefined"!=typeof i.height&&(this.size.height=i.height),"undefined"!=typeof i.x&&(this.position.x=i.x),"undefined"!=typeof i.y&&(this.position.y=i.y),"undefined"!=typeof i.levelIndex&&(this.levelIndex=i.levelIndex),"undefined"!=typeof i.playerPosition&&(this.playerPosition=i.playerPosition)),this.draw=function(i){},this.update=function(){if(this.collide){var i=grove.checkForCollision(grove.hero,this);i&&this.awardGoal()}},this.awardGoal=function(){grove.hero.position.x=this.playerPosition.x,grove.hero.position.y=this.playerPosition.y,grove.changeLevel(this.levelIndex)}}}(),function(){"use strict";grove.objectTemplates.badFireElemental=function(i){function t(){var i=s+o;i===e.route.length?e.loop?i=0:(o=-1,i+=-2):-1===i&&(o=1,i=1),"undefined"!=typeof e.route[s].pause?setTimeout(function(){s=i,h=!1,a=!1},e.route[s].pause):(s=i,h=!1,a=!1)}this.speed=1.2,this.size={width:64,height:96},this.position={x:500,y:500},this.route=[],this.loop=!0,this.opacity=1,this.collide=!0,this.followHero=!0,this.damage=10,this.initialHealth=30,this.health=this.initialHealth,this.scale=1,this.lastDamageTaken=0,this.fireballCastingTime=800,this.fireballDelay=5e3,this.lastFireball=Date.now(),this.image=new Image,this.image.src="img/bad-fire-chick.png",this.millisecondsPerFrame=6,this.animationFrameCount=3,this.animationFrame=0,this.timeSinceLastAnimation=0;var e=this,s=0,o=1,h=!1,a=!1;"undefined"!=typeof i&&("undefined"!=typeof i.width&&(this.size.width=i.width),"undefined"!=typeof i.height&&(this.size.height=i.height),"undefined"!=typeof i.speed&&(this.speed=i.speed),"undefined"!=typeof i.image&&(this.image=i.image),"undefined"!=typeof i.loop&&(this.loop=i.loop),"undefined"!=typeof i.x&&(this.position.x=i.x),"undefined"!=typeof i.y&&(this.position.y=i.y),"undefined"!=typeof i.route&&(this.route=i.route,this.position.x=this.route[0].x,this.position.y=this.route[0].y,this.route.length>1&&t())),this.launchFireball=function(i){this.castingFireball=!0;var t=this;setTimeout(function(){if(t.health<=0)return void(t.castingFireball=!1);var e={x:t.position.x,y:t.position.y,vectorX:i.x,vectorY:i.y};grove.sounds.fireball.play();var s=new grove.objectTemplates.Fireball(e);grove.fireballs.push(s),setTimeout(function(){t.castingFireball=!1},500)},this.fireballCastingTime)},this.takeDamage=function(i){var t=Date.now();t>this.lastDamageTaken+500&&(this.lastDamageTaken=t,this.health-=i,this.opacity=.5+this.health/this.initialHealth,this.scale=.5+this.health/this.initialHealth,this.scale<.2&&(this.scale=.2),this.scale>1&&(this.scale=1),this.health<=0&&(this.opacity=.3),0===grove.hero.lastDirection.both?tween.to(this.position,.3,{y:"+=100"}):1===grove.hero.lastDirection.both?tween.to(this.position,.3,{x:"-=100"}):2===grove.hero.lastDirection.both?tween.to(this.position,.3,{x:"+=100"}):3===grove.hero.lastDirection.both&&tween.to(this.position,.3,{y:"-=100"}))},this.draw=function(i){var t=this.animationFrame*this.size.width;1!==this.opacity?(grove.ctxAction.globalAlpha=this.opacity,grove.ctxAction.drawImage(this.image,t,0,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width*this.scale,this.size.height*this.scale),grove.ctxAction.globalAlpha=1):grove.ctxAction.drawImage(this.image,t,0,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width*this.scale,this.size.height*this.scale)},this.update=function(i){if(!(this.health<=0)){if(this.collide&&grove.hero.flying===!1){var e=grove.checkForCollision(grove.hero,this);e!==!1&&grove.hero.damage(this.damage)}this.timeSinceLastAnimation+=i,this.timeSinceLastAnimation>this.millisecondsPerFrame&&(this.timeSinceLastAnimation=0,this.animationFrame++,this.animationFrame>this.animationFrameCount&&(this.animationFrame=0));var o={x:0,y:0};if(this.followHero&&grove.hero.flying===!1)o.x=grove.hero.position.x-this.position.x,o.y=grove.hero.position.y-this.position.y,this.performMovement(i,o);else if(this.route.length>1&&(o.x=this.route[s].x-this.position.x,o.y=this.route[s].y-this.position.y,0!==o.x||0!==o.y)){var n=this.performMovement(i,o);o.x=Math.floor(o.x),o.y=Math.floor(o.y),Math.abs(n.x)+1>=Math.abs(o.x)&&(this.position.x=this.route[s].x,h=!0),Math.abs(n.y)+1>=Math.abs(o.y)&&(a=!0,this.position.y=this.route[s].y),h&&a&&t()}}},this.performMovement=function(i,t){if(!this.castingFireball){var e=Date.now();if(e>this.lastFireball+this.fireballDelay)return this.lastFireball=e,void this.launchFireball(t);var s=Math.sqrt(t.x*t.x+t.y*t.y),o={x:0,y:0};return 0!==t.x&&(o.x=t.x/s*this.speed*i,this.position.x+=o.x),0!==t.y&&(o.y=t.y/s*this.speed*i,this.position.y+=o.y),o}}}}(),function(){"use strict";grove.objectTemplates.Fireball=function(i){this.speed=5.25,this.size={width:32,height:32},this.position={x:500,y:500},this.opacity=1,this.collide=!0,this.damage=20,this.vector={x:0,y:0},"undefined"!=typeof i&&("undefined"!=typeof i.x&&(this.position.x=i.x),"undefined"!=typeof i.y&&(this.position.y=i.y),"undefined"!=typeof i.vectorX&&(this.vector.x=i.vectorX),"undefined"!=typeof i.vectorY&&(this.vector.y=i.vectorY)),this.animationFrame=0,this.animationFrameCount=3,this.timeSinceLastAnimation=0,this.millisecondsPerFrame=6,this.image=new Image,this.image.src="img/bad-fireball.png",this.draw=function(i){var t=this.animationFrame*this.size.width,e=0;grove.ctxAction.drawImage(this.image,t,e,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width,this.size.height)},this.update=function(i){if(this.timeSinceLastAnimation+=i,this.timeSinceLastAnimation>this.millisecondsPerFrame&&(this.timeSinceLastAnimation=0,this.animationFrame++,this.animationFrame>this.animationFrameCount&&(this.animationFrame=0)),this.collide&&grove.hero.flying===!1){var t=grove.checkForCollision(grove.hero,this);t!==!1&&grove.hero.damage(this.damage)}this.performMovement(i,this.vector)},this.performMovement=function(i,t){var e=Math.sqrt(t.x*t.x+t.y*t.y),s={x:0,y:0};return 0!==t.x&&(s.x=t.x/e*this.speed*i,this.position.x+=s.x),0!==t.y&&(s.y=t.y/e*this.speed*i,this.position.y+=s.y),s}}}(),function(){"use strict";grove.objectTemplates.Hud=function(){this.size={width:486,height:191},this.position={x:20,y:20},this.spriteOffset={x:1,y:1},this.currentOffsetName="druid",this.portrait={size:{width:114,height:114},position:{x:36+this.position.x,y:30+this.position.y}},this.portraitOffsets={druid:{x:0,y:193},wolf:{x:115,y:193},owl:{x:230,y:193}},this.icon={size:{width:69,height:69},position:{x:154+this.position.x,y:73+this.position.y}},this.iconOffsets={druid:{x:489,y:0},wolf:{x:559,y:0},owl:{x:629,y:0}},this.healthBar={size:{width:294,height:35},position:{x:154+this.position.x,y:30+this.position.y},healthSpriteOffset:{x:0,y:318},damageSpriteOffset:{x:0,y:354}},this.image=new Image,this.image.src="img/hud.png",this.draw=function(){grove.ctxGui.clearRect(this.position.x,this.position.y,this.size.width,this.size.height);var i=this.portraitOffsets[this.currentOffsetName];grove.ctxGui.drawImage(this.image,i.x,i.y,this.portrait.size.width,this.portrait.size.height,this.portrait.position.x,this.portrait.position.y,this.portrait.size.width,this.portrait.size.height),grove.ctxGui.drawImage(this.image,this.healthBar.damageSpriteOffset.x,this.healthBar.damageSpriteOffset.y,this.healthBar.size.width,this.healthBar.size.height,this.healthBar.position.x,this.healthBar.position.y,this.healthBar.size.width,this.healthBar.size.height);var t=this.healthBar.size.width*grove.hero.displayLife/grove.hero.initialLife;grove.ctxGui.drawImage(this.image,this.healthBar.healthSpriteOffset.x,this.healthBar.healthSpriteOffset.y,t,this.healthBar.size.height,this.healthBar.position.x,this.healthBar.position.y,t,this.healthBar.size.height);var e=this.iconOffsets[this.currentOffsetName];grove.ctxGui.drawImage(this.image,e.x,e.y,this.icon.size.width,this.icon.size.height,this.icon.position.x,this.icon.position.y,this.icon.size.width,this.icon.size.height),grove.ctxGui.drawImage(this.image,this.spriteOffset.x,this.spriteOffset.y,this.size.width,this.size.height,this.position.x,this.position.y,this.size.width,this.size.height)},this.switchForm=function(i){this.currentOffsetName=i,this.draw()},this.updateHealthBar=function(){}}}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-tutorial.jpg",edgeAdjustments:{left:0,top:0,right:70,bottom:0},elementals:[],trees:[],goals:[{x:1910,y:0,width:10,height:1024,levelIndex:1,playerPosition:{x:40,y:490}}]})}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-level-1.jpg",edgeAdjustments:{left:70,top:0,right:0,bottom:70},elementals:[{x:800,y:550}],trees:[{x:300,y:100},{x:800,y:100},{x:300,y:720},{x:1400,y:100},{x:1400,y:400},{x:1400,y:720}],goals:[{x:0,y:0,width:10,height:1024,levelIndex:0,playerPosition:{x:1780,y:490}},{x:0,y:1014,width:1920,height:10,levelIndex:2,playerPosition:{x:900,y:40}}]})}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-level-2.jpg",edgeAdjustments:{left:0,top:70,right:0,bottom:70},elementals:[{x:100,y:490},{x:1800,y:490}],trees:[{x:20,y:530},{x:70,y:530},{x:140,y:530},{x:210,y:530},{x:280,y:530},{x:350,y:530},{x:420,y:530},{x:490,y:530},{x:560,y:530},{x:630,y:530},{x:700,y:530},{x:770,y:530},{x:840,y:530},{x:910,y:530},{x:980,y:530},{x:1050,y:530},{x:1120,y:530},{x:1190,y:530},{x:1260,y:530},{x:1330,y:530},{x:1400,y:530},{x:1470,y:530},{x:1540,y:530},{x:1610,y:530},{x:1680,y:530},{x:1730,y:530}],goals:[{x:0,y:0,width:1920,height:10,levelIndex:1,playerPosition:{x:900,y:884}},{x:0,y:1014,width:1920,height:10,levelIndex:3,playerPosition:{x:900,y:40}}]})}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-level-3.jpg",edgeAdjustments:{left:0,top:70,right:70,bottom:0},elementals:[{x:400,y:490},{x:600,y:490},{x:800,y:490},{x:200,y:800},{x:700,y:800},{x:1500,y:800}],trees:[{x:50,y:500},{x:1560,y:680}],goals:[{x:0,y:0,width:1920,height:10,levelIndex:2,playerPosition:{x:900,y:884}},{x:1910,y:0,width:10,height:1024,levelIndex:4,playerPosition:{x:40,y:490}}]})}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-level-4.jpg",edgeAdjustments:{left:70,top:0,right:70,bottom:0},trees:[],elementals:[{x:1600,y:690},{x:1600,y:490},{x:1600,y:290},{x:1600,y:190},{x:1600,y:390},{x:1600,y:790},{x:1e3,y:790},{x:1e3,y:490},{x:1e3,y:290},{x:1e3,y:190},{x:1e3,y:390},{x:400,y:500}],goals:[{x:0,y:0,width:20,height:1024,levelIndex:3,playerPosition:{x:1780,y:490}},{x:1900,y:0,width:20,height:1024,levelIndex:5,playerPosition:{x:40,y:490}}]})}(),function(){"use strict";grove.levels.push({backgroundImageSrc:"img/background-level-5.jpg",edgeAdjustments:{left:70,top:0,right:70,bottom:0},elementals:[],trees:[{x:50,y:700},{x:1600,y:700}],goals:[{x:0,y:0,width:10,height:1024,levelIndex:4,playerPosition:{x:1780,y:490}}]})}();