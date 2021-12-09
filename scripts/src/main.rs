extern crate notify;

use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::sync::mpsc::channel;
use std::time::Duration;

mod parse_file;

// Watch directory, run build script on individual files that change

// build script:
//   1. goes through html file and looks for "<import"
//     splits attributes, pulls file from src
//     load src file, string replace attributes into {{ text }} templates
//     string replace baked import into original file
//   2. look for "markdown" attribute on html nodes
//     runs markdown crate on them
//     string replace finished html back into html file
//   3. writes new string to preview directory
//   4. runs a local server with hot reload on the preview directory
//   5. has flag for preview / true build to out directory

fn main() {
    // Create a channel to receive the events.
    let (tx, rx) = channel();

    // Create a watcher object, delivering debounced events.
    // The notification back-end is selected based on the platform.
    let mut watcher = watcher(tx, Duration::from_secs(1)).unwrap();

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher.watch("../src", RecursiveMode::Recursive).unwrap();

    loop {
        match rx.recv() {
            Ok(event) => match &event {
                DebouncedEvent::Write(path) => {
                    parse_file::parse_file(path);
                }
                _ => {
                    println!("{:?}", &event)
                }
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}
