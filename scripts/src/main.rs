extern crate notify;
use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::mpsc::channel;
use std::time::Duration;
use walkdir::WalkDir;

mod bake_imports;
mod bake_markdown;
mod copy_file;
mod write_file;

fn main() {
    let args: Vec<String> = env::args().collect();

    // Find the src directory to build from
    let src_directory = env::current_dir().unwrap().join("src");

    // Do the build
    build_directory(&src_directory);

    // If we're watching, start watching
    if args.contains(&String::from("--watch")) {
        watch(&src_directory);
    }
}

// Build and copy an entire src directory to dist
fn build_directory(src_directory: &PathBuf) {
    // Delete the dist directory
    if let Some(src_path_str) = src_directory.to_str() {
        let dist_path_str = src_path_str.replace("src", "dist");
        println!("Clearing directory: {}", dist_path_str);
        if std::path::Path::new(&dist_path_str).is_dir() {
            std::fs::remove_dir_all(std::path::PathBuf::from(dist_path_str))
                .expect("Could not clear dist directory before build")
        }
    }

    // Go through all the files in src and build them or copy them over
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

        // Handle the file based on its type:
        let entry_path = PathBuf::from(entry.path());
        build_file(&entry_path);
    }
}

/// Watch a directory and rebuild changed HTML files
fn watch(src_directory: &std::path::PathBuf) {
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
                    build_file(path);
                }
                DebouncedEvent::Create(path) => {
                    build_file(path);
                }
                _ => {
                    println!("{:?}", &event)
                }
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}

/// Mainly routes files to their correct parser based on file extension
fn build_file(file_path: &std::path::PathBuf) {
    // Grab some information about the file:
    let file_name = file_path
        .file_name()
        .expect("Could not find file name")
        .to_str()
        .unwrap();
    let file_extension = file_path.extension().and_then(std::ffi::OsStr::to_str);

    // Don't do anything for files that start with an underscore:
    if file_name.chars().next().unwrap_or_default() == '_' {
        return;
    }

    // Decide what to do based on the file's extension:
    match file_extension {
        // HTML gets checked and baked for imports
        Some("html") => {
            println!("Building html: {:?}", &file_path);
            // Load the HTML from the file system
            let raw_html = fs::read_to_string(&file_path).expect("Could not read HTML file ^^^");
            let final_html = bake_imports::bake_imports(&file_path, raw_html);
            write_file::write_file(file_path, &final_html)
        }
        // Markdown gets converted to HTML, then checked for imports
        Some("md") => {
            println!("Building md: {:?}", &file_path);
            // Load the MD from the file system
            let raw_md = fs::read_to_string(file_path).expect("Could not read MD file");
            // Load the closest HTML template for the markdown
            // Don't search higher than the original /src dir
            let highest_search_dir = std::env::current_dir().unwrap().join("src");
            let mut template_file_path = PathBuf::new();
            for ancestor in file_path.ancestors() {
                template_file_path = ancestor.join("__template.html");
                if template_file_path.exists() || ancestor == highest_search_dir {
                    break;
                }
            }

            let template_raw_html = fs::read_to_string(&template_file_path)
                .expect("Could not find _template.html file for markdown");

            let mut final_html = bake_markdown::bake_markdown(raw_md, template_raw_html);
            // We need to use the source path for the template as imports are relative to the template
            final_html = bake_imports::bake_imports(&template_file_path, final_html);
            let modified_source_path = file_path.with_extension("html");
            write_file::write_file(&modified_source_path, &final_html);
        }
        // Anything else, copy over directly:
        _ => copy_file::copy_file(file_path),
    }
}
