(function () { // =D
    'use strict';


    // PLANETS COLLECTION
    var PlanetCollection = Backbone.Collection.extend({
        model: skydock.modelTemplates.PlanetModel
    });
    skydock.planetCollection = new PlanetCollection();


    // PLANET MODEL
    skydock.modelTemplates.PlanetModel = Backbone.Model.extend({
        defaults: {
            name: 'Happy Planet',
            greeting: [],
            position: {
                x: 0,
                y: 0
            },
            color: 'green',
            size: 'small',
            personality: 'continents'
        }
    });


    // PLANETS DATA
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Jason Majors',
        greeting: [
            'Hey you!  Slowpoke!  Come over here!',
            'Are you by any chance exploring?',
            'Are you a great explorer?',
            'Can you help a planet out?',
            'Can you deliver this letter to . .. Stephanie Starlight?',
            'She\'s my girlfriend, but our orbits have kept us apart . . .',
            ' . . . for a couple millenia . . .',
            'So help me out, ya?',
            'I\'ll give you this awesome engine I have in exchange!',
            'Thanks.  And good luck, young traveler.',
            'She\'s out there somewhere . . .'
        ],
        position: {
            x: 3700,
            y: 4175
        },
        color: 'blue',
        size: 'medium',
        personality: 'jason'
    }));

    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Stephanie Starlight',
        greeting: [
            'Over here!  I\'m over here!',
            'Hello, young traveler.  I heard you were looking for me.',
            'Have you come far?',
            'Oh my, a letter from Jason Majors?',
            'One moment while I read .. . ..',
            ' . ... ..',
            ' ...... .',
            'Oh my gosh, I love that planet so!',
            'He\'s the most romantic Class M I\'ve ever met.',
            'I don\'t know how to thank you!',
            'Here, take this!  It\'s a gold star!',
            'It will increase your top speed,',
            'And make you even prettier than you already are!',
            'May your travels be swift, mighty explorer.',
            'I will always remember how you helped us.'
        ],
        position: {
            x: 6500,
            y: 500
        },
        color: 'yellow',
        size: 'medium',
        personality: 'stephanie'
    }));

    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Pluto',
        greeting: [
            'I was IN, but just like that, just like that . .  .',
            'You believe in me, don\'t you?'
        ],
        position: {
            x: 4700,
            y: 3800
        },
        color: 'small',
        size: 'gray',
        personality: 'worried'
    }));


    /* romeo and juliet */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Romeo',
        greeting: [],
        position: {
            x: 3000,
            y: 3000
        },
        color: 'gray',
        size: 'small',
        personality: 'dead'
    }));

    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Juliet',
        greeting: [],
        position: {
            x: 3150,
            y: 3000
        },
        color: 'gray',
        size: 'small',
        personality: 'dead'
    }));


    /* jack and rose */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Jack',
        greeting: [
            'Promise me you\'ll survive.',
            'That you won\'t give up, no matter what happens, no matter how hopeless.',
            'Never let go.'
        ],
        position: {
            x: 4550,
            y: 5000
        },
        color: 'sand',
        size: 'small',
        personality: 'determined'
    }));

    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Rose',
        greeting: [
            'I\'ll never let go, Jack. I\'ll never let go.',
            'I promise.'
        ],
        position: {
            x: 4850,
            y: 4950
        },
        color: 'orange',
        size: 'large',
        personality: 'scared-left'
    }));

    /* hector */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Hyper Hector',
        greeting: [
            'Heading to deep space, young one?',
            'There\'s Sirius Black holes out there.',
            'No joke.'
        ],
        position: {
            x: 3250,
            y: 4650
        },
        color: 'red-2',
        size: 'medium',
        personality: 'hopeful'
    }));

    /* saturn */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Saturn',
        greeting: [
            'Want to hear my poem?',
            'One Ring to rule them all,',
            'One Ring to find them,',
            'One Ring to bring them all and in the darkness bind them . . .',
            'In the land of Saturn where rings are awesome!'
        ],
        position: {
            x: 5750,
            y: 4350
        },
        color: 'red-2',
        size: 'large',
        personality: 'hopeful'
    }));

    /* earth */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Gaia',
        greeting: [
            'Perhaps I\'m just a stepping stone in evolution?',
            'Perhaps humans will adapt . . . ',
            ' . . . to outlive me?'

        ],
        position: {
            x: 4450,
            y: 5950
        },
        color: 'earth',
        size: 'medium'
    }));

    /* luna lovegood */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Luna Lovegood',
        greeting: [
            'I\'m glad you\'re here, it\'s like being with a friend.',
            'And don\'t worry, you\'re not going mad,',
            'I see them too.'
        ],
        position: {
            x: 4050,
            y: 6100
        },
        color: 'gray',
        size: 'tiny'
    }));

    /* hagrid */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Hagrid',
        greeting: [
            'Crikey, I\'d love a dragon.',
            'Oh, and . . .',
            'also . . .',
            ' . . . . . . . ',
            'You\'re a wizard, \'Arry.',
        ],
        position: {
            x: 2000,
            y: 4150
        },
        color: 'red',
        size: 'large',
        personality: 'determined'
    }));

    /* snape */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Snape Supernova',
        greeting: [
            'You have your mother\'s eyes.',
            'But your father was a swine.',
            '50 points from gryffindor.'
        ],
        position: {
            x: 5000,
            y: 3150
        },
        color: 'green',
        size: 'medium',
        personality: 'bully'
    }));

    /* goats */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Goat',
        greeting: [
            'HAYY',
            'HAYYYYYYyYYY',
            '-',
            'HAYYyY',
        ],
        position: {
            x: 4020,
            y: 2500
        },
        color: 'orange',
        size: 'large',
        personality: 'stupid'
    }));

    /* wookies */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Kashyyyk',
        greeting: [
            'Wyaaaaaa. Ruh ruh.',
            'Ruh gwyaaaag.',
            'Gu waagaa ahawag?',
            'Ruow.',
        ],
        position: {
            x: 1020,
            y: 4500
        },
        color: 'green',
        size: 'small'
    }));

    /* spiceworld */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Spiceworld',
        greeting: [
            'Yo I\'ll tell you what I want, what I really really want!',
            'So tell me what you want, what you really really want! ',
            'I wanna <_<',
            'I wanna >_>',
            'I wanna <_<',
            'I wanna >_>',
            'I wanna really,',
            'really really wanna zigazig ha!',
        ],
        position: {
            x: 6020,
            y: 2225
        },
        color: 'sand',
        size: 'large'
    }));

    /* dune */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Dune',
        greeting: [
            'Remember, young traveler:',
            'He who controls the spice controls the universe.',
        ],
        position: {
            x: 2020,
            y: 2225
        },
        color: 'sand',
        size: 'large'
    }));

    /* tupac */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Tupac',
        greeting: [
            'Nah man, that\'s not me . . .',
            'I get that all the time . . .',
            'Seriously, my name\'s Herbert.',
            'Enough with the questions!',
            'I\'m not a killa, but don\'t push me.',
        ],
        position: {
            x: 7020,
            y: 1225
        },
        color: 'green',
        size: 'large',
        personality: 'grumpy'
    }));

    /* britney */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Britney',
        greeting: [
            'La la la la la hemm hemmmmm',
            ' // Too high, can\'t come dowwnnn // ',
            ' // Losing my head, spinning round and round //',
            ' // Do you feel me now? // ',
            'hemmm hemmmmmm . . .',
        ],
        position: {
            x: 7020,
            y: 3225
        },
        color: 'red',
        size: 'large',
        personality: 'happy'
    }));

    /* Footman */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Footman',
        greeting: [
            'Awaiting orders',
            'Your command?',
            'Yes, sire?',
            'Are you still touching me?',
            '"Join the army," they said.',
            '"See the world," they said.',
            'I\'d rather be sailing.'
        ],
        position: {
            x: 3500,
            y: 1500
        },
        color: 'gray',
        size: 'small',
        personality: 'determined'
    }));

    /* Waldo */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Waldo',
        greeting: [
            'Oh man!',
            'You got me!',
            'What??!',
            'You\'re looking for someone else?',
            'MMHufff.'
        ],
        position: {
            x: 1500,
            y: 1500
        },
        color: 'waldo',
        size: 'medium',
        personality: 'scared'
    }));

    /* Planet Fitness */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Planet Fitness',
        greeting: [
            'Hey,',
            'You\'re not a lunk, are you?',
            'I hate lunks.',
            'Don\'t judge me.'
        ],
        position: {
            x: 2000,
            y: 500
        },
        color: 'purple',
        size: 'medium',
        personality: 'bully'
    }));

    /* Aesop Rock */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Aesop Rock',
        greeting: [
            'Must not sleep . . . ',
            'Must warn others . . . '
        ],
        position: {
            x: 3200,
            y: 800
        },
        color: 'red',
        size: 'large',
        personality: 'determined'
    }));

    /* Elvis Presley */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Elvis Presley',
        greeting: [
            'I\'m trying to keep a level head,',
            'You have to be careful out here in the galaxy.',
            'It\'s so easy to get turned around.'
        ],
        position: {
            x: 600,
            y: 6200
        },
        color: 'red-2',
        size: 'large',
        personality: 'determined'
    }));

    /* Yoda */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Yoda',
        greeting: [
            'Know your quest,',
            'I do.',
            'Learn to trust your instincts,',
            'You will.',
            'Make more money off Star Wars,',
            'They will.'
        ],
        position: {
            x: 4750,
            y: 900
        },
        color: 'green',
        size: 'small',
        personality: 'worried'
    }));

    /* Ferris */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Ferris',
        greeting: [
            'Haccmmmkkk mehhhh',
            'Ofjjjjjjjjckckkk',
            'I\'m so sick.',
            ' . . . You\'re still here? It\'s over!'
        ],
        position: {
            x: 2000,
            y: 6600
        },
        color: 'green',
        size: 'small',
        personality: 'worried'
    }));


    /* Atlas */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Atlas',
        greeting: [
            'HARRRREERRRRRRRR',
            'Lend a hand?'
        ],
        position: {
            x: 5400,
            y: 7000
        },
        color: 'red-2',
        size: 'small',
        personality: 'grumpy'
    }));

    /* Celestial Sphere */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Celestial Sphere',
        greeting: [
            ' . . . hee hee . . .',
            'I\'m heavy!',
            ' . . . hee hee . . .',
        ],
        position: {
            x: 5400,
            y: 6845
        },
        color: 'gray',
        size: 'large',
    }));

    /* Lego */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Lego',
        greeting: [
            'Everything is awesome!',
            'Everything is cool when you\'re part of a team!',
            'Everything is awesome when we\'re living our dream!',
            'Everything is awesomeeeeee!',
        ],
        position: {
            x: 7200,
            y: 4900
        },
        color: 'yellow',
        size: 'small',
        personality: 'happy'
    }));

    /* Deathstar */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'A Moon?',
        greeting: [
            'Fully operational!'
        ],
        position: {
            x: 6000,
            y: 5500
        },
        color: 'deathstar',
        size: 'small',
        personality: 'evil'
    }));





    /* non-references */

    /*  Allison Asteroid */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Allison Asteroid',
        greeting: [
            'Stephanie Starlight?',
            'Oh ya!  She\'s my friend!',
            'I\'ll let her know you\'re looking for her.'
        ],
        position: {
            x: 3100,
            y: 3500
        },
        color: 'yellow',
        size: 'small',
        personality: 'hopeful'
    }));

    /*  Kayla Celestial */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Kayla Celestial',
        greeting: [
            'Do you like to read?',
            'I\'d love some suggestions.'
        ],
        position: {
            x: 6200,
            y: 3375
        },
        color: 'purple',
        size: 'small',
        personality: 'happy'
    }));

    /*  Franky Photon */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Franky Photon',
        greeting: [
            'Don\'t bother me, kid.',
            'Beat it.'
        ],
        position: {
            x: 1200,
            y: 2775
        },
        color: 'orange',
        size: 'medium',
        personality: 'grumpy'
    }));

    /*  Jennifer */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Jennifer Jethead',
        greeting: [
            'O.M.G.',
            'You are just the cutest little ship I\'ve ever seen.',
            'You can orbit me any time you like!'
        ],
        position: {
            x: 1325,
            y: 5175
        },
        color: 'yellow',
        size: 'small',
        personality: 'happy'
    }));

    /*  Ralph Radiowave */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Ralph Radiowave',
        greeting: [
            'What\'s that?',
            'You\'re looking for Stephanie Starlight?',
            'Me too!',
            'She\'s a class 10 hottie!'
        ],
        position: {
            x: 2790,
            y: 5575
        },
        color: 'orange',
        size: 'medium',
        personality: 'hopeful'
    }));

    /*  Puppy */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Puppy',
        greeting: [
            'Puppy is a world run by cats.',
            'Cats love irony.',
            'And lasers.',
            'Irony and lasers.'
        ],
        position: {
            x: 790,
            y: 1000
        },
        color: 'green',
        size: 'small',
        personality: 'evil'
    }));

    /* Sarah */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Sarah',
        greeting: [
            'Hello little ship,',
            'I\'m just a slave . . .',
            ' . . . a slave to the solar system.'
        ],
        position: {
            x: 4500,
            y: 1700
        },
        color: 'blue-2',
        size: 'medium',
        personality: 'sad'
    }));

    /* Geoff */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Geoffrey Galactic',
        greeting: [
            'Stephanie Starlight?',
            'Last I saw, her vector put her in the far reaches.',
        ],
        position: {
            x: 7000,
            y: 6500
        },
        color: 'red',
        size: 'large',
        personality: 'hopeful'
    }));

    /* Kevin Kelvin */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Kevin Kelvin',
        greeting: [
            'Stephanie Starlight is supernova hot!',
            'Good luck, little buddy . . . ',
            'You\'re going to need it.'
        ],
        position: {
            x: 1300,
            y: 7100
        },
        color: 'orange',
        size: 'large',
        personality: 'evil'
    }));

    /* Sheep */
    skydock.planetCollection.add(new skydock.modelTemplates.PlanetModel({
        name: 'Sheep',
        greeting: [
            ' . . . . . ',
            ' . . . ',
            ' . . . . .  ',
            ' . . . ',
            ' . . . . .  ',
            ' . . . '
        ],
        position: {
            x: 4000,
            y: 7100
        },
        color: 'yellow',
        size: 'large',
        personality: 'stupid'
    }));







})();