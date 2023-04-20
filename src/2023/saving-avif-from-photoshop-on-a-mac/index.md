---
title: Saving AVIF images from Photoshop on MacOS in 2023
publish_date: 2023-04-20
author: Stephen Haney
tags: photoshop, avif
---

AVIF is an amazing image format for the web – you can get much better file sizes and image quality than JPG. Plus it supports transparency! What's not to love? I see a near future where it's the default image format.

There are two drawbacks as of April, 2023:

1. Edge doesn't support it yet, but it's <a href="https://twitter.com/Leopeva64/status/1647273202568052738" target="_blank">behind a flag in Edge Canary</a> so it's likely coming very soon.

2. You can't easily save AVIF files from Photoshop or Figma yet.

Let's fix the latter! Here's a screenshot of my Photoshop File Menu with the script. It's 1106x580 with a transparent background and weighs in at 33KB.

<img src="photoshop-file-menu-save-as-avif.avif" width="553" height="290" alt="You can add a Save as AVIF command to your Photoshop File menu" />

## I decided not to wait for Edge

For <a href="https://summoners.io">summoners.io</a>, my WebGPU based fantasy card game project, I'm using AVIF files now. Summoners uses hundreds of textures for all of its cards, and I want it to be playable on a mobile phone. AVIF to the rescue: I'm seeing much better image quality than JPG at 0.5 to 0.667 the file sizes.

Looking at analytics, my Edge traffic is basically zero. Until Edge ships AVIF support, I'll just put up a warning banner for now that says you need to use a different browser.

## Saving from Photoshop

One problem remains: my current workflow is to save a PNG from Photoshop, run a terminal command to convert to an AVIF, and then manually delete the PNG. That's not great when I need to save hundreds of images. Plus I often need to go back and make content changes inside the images. I'm finding the workflow is actually making me avoid doing content updates.

So, let's write a Photoshop Script to automate this.

### The best AVIF converter I've found so far is cavif

cavif is an PNG to AVIF converter that's written in rust. It's fast and produces excellent image files, in my experience. You can download cavif here: <a href="https://github.com/kornelski/cavif-rs">https://github.com/kornelski/cavif-rs</a>

There's a link to binaries or you can use rust to <a href="https://github.com/kornelski/cavif-rs">build it yourself</a> (which is what I did).

### Creating the Photoshop Script to Save AVIF files

You'll put your script inside the Photoshop Scripts folder. This makes it show up in the File menu inside Photoshop. I named my file `Save as AVIF.jsx` and placed it into this folder: `/Applications/Adobe Photoshop 2023/Presets/Scripts`.

Second, use the code below in your script.

There are three settings you can adjust in the script:

1. You'll need to set the path to cavif itself
2. The --quality setting for cavif. It's a 0 to 100 scale. I use 92 as a nice balance between file size and quality for my needs.
3. I'm using the --overwrite flag because the Photoshop file picker will already prompt you to replace an existing file before running the cavif command. If you remove `--overwrite`, you won't be able to overwrite existing files with this script.

```jsx
// Save the current document as a temporary PNG file
var pngFile = new File(Folder.desktop + '/temp.png');
var pngSaveOptions = new PNGSaveOptions();
app.activeDocument.saveAs(pngFile, pngSaveOptions, true, Extension.LOWERCASE);

// Prompt the user for a save location
var avifFile = File.saveDialog('Save the AVIF file as:', 'AVIF:*.avif');

// Ensure the selected file has the .avif extension
if (avifFile.name.slice(-5).toLowerCase() !== '.avif') {
  avifFile = new File(avifFile.path + '/' + avifFile.name + '.avif');
}

// Check if the user selected a file
if (avifFile !== null) {
  var command;

  // Check the operating system to create the appropriate command
  if ($.os.indexOf('Windows') !== -1) {
    command =
      'cmd.exe /c /REPLACE_WITH_PATH_TO/cavif "' +
      pngFile.fsName +
      '" -o "' +
      avifFile.fsName +
      '" --quality 92';
  } else {
    // macOS or Linux
    command =
      '/REPLACE_WITH_PATH_TO/cavif "' +
      pngFile.fsName +
      '" -o "' +
      avifFile.fsName +
      '" --quality 92';
  }

  // Execute the command
  var result = app.system(command);

  // Clean up the temporary PNG file
  pngFile.remove();

  // Check the result
  if (result !== 0) {
    alert('Error: Failed to create AVIF file.');
  }
} else {
  // User did not pick a file path
  // Clean up the temporary PNG file
  pngFile.remove();
}
```

And you're done! Happy saving.

FYI: I noticed some AVIF converters can desaturate colors in output images. I did NOT experience that problem with the cavif library used here.

## Questions or ideas:

<a href="https://github.com/StephenHaney/stephenhaney/issues/7">Discuss this post on GitHub</a>
