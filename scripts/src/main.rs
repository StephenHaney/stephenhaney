extern crate notify;
use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::mpsc::channel;
use std::time::Duration;
use walkdir::WalkDir;

mod bake_html;
mod copy_file;

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
    let args: Vec<String> = env::args().collect();

    // Keep track of HTML we've already compiled so we don't have to do it multiple times
    // if a file is used multiple times in a graph
    let baked_html_cache = &mut HashMap::<PathBuf, String>::new();

    // Find the src directory to build from
    let src_directory = env::current_dir().unwrap().join("src");

    // Do the build
    build_directory(baked_html_cache, &src_directory);

    // If we're watching, start watching
    if args.contains(&String::from("--watch")) {
        watch(baked_html_cache, &src_directory);
    }
}

// Build and copy an entire src directory to dist
fn build_directory(html_cache: &mut HashMap<PathBuf, String>, src_directory: &PathBuf) {
    for entry in WalkDir::new(src_directory)
        .into_iter()
        .filter_map(Result::ok)
    {
        // Skip directories
        if let Ok(metadata) = entry.metadata() {
            if metadata.is_dir() {
                continue;
            }
        }

        let entry_path = PathBuf::from(entry.path());
        let file_extension = &entry_path.extension().and_then(std::ffi::OsStr::to_str);

        match file_extension {
            // Run HTML through special processing:
            Some("html") => {
                let local_copy_entry_path = entry_path.to_owned();

                if html_cache.contains_key(&entry_path) == false {
                    // First time we've seen this file, bake it:
                    let baked_html = bake_html::bake_html_file(html_cache, &entry_path);
                    html_cache.insert(entry_path, baked_html);
                }

                // Write the baked file
                if let Some(path_as_str) = local_copy_entry_path.to_str() {
                    // Build the output path
                    let final_path_string = path_as_str.replacen("src", "dist", 1);
                    let final_path = std::path::PathBuf::from(&final_path_string);
                    if let Some(final_path_directories) = final_path.parent() {
                        // Create the directories we need if they don't exist yet:
                        fs::create_dir_all(&final_path_directories)
                            .expect("Could not create directories for the dist folder");
                        // Grab the final HTML from our cache:
                        let baked_html_to_write =
                            html_cache.get(&local_copy_entry_path).expect("Must exist");
                        // Write the file:
                        fs::write(final_path, baked_html_to_write).expect("Unable to write file");
                    }
                }
            }
            // Anything else, copy over directly:
            _ => copy_file::copy_file(&entry_path),
        }
    }
}

/// Watch a directory and rebuild changed HTML files
fn watch(html_cache: &mut HashMap<PathBuf, String>, src_directory: &std::path::PathBuf) {
    // Create a channel to receive the events.
    let (tx, rx) = channel();
    // Create a watcher object, delivering debounced events.
    // The notification back-end is selected based on the platform.
    let mut watcher = watcher(tx, Duration::from_millis(200)).unwrap();

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher
        .watch(src_directory, RecursiveMode::Recursive)
        .unwrap();

    loop {
        match rx.recv() {
            Ok(event) => match &event {
                DebouncedEvent::Write(path) => {
                    // todo delete from html_cache
                    bake_html::bake_html_file(html_cache, path);
                }
                _ => {
                    println!("{:?}", &event)
                }
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}
