use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

mod bake_imports;
mod bake_markdown;

// Runs all processing we need to turn a raw HTML file into a finished, polished file, ready for prod
pub fn bake_html_file(
  html_cache: &mut HashMap<PathBuf, String>,
  path: &std::path::PathBuf,
) -> String {
  println!("Building {:?}", &path);

  // Load the HTML from the file system
  if let Ok(html_from_file) = fs::read_to_string(path) {
    // Move through our logic to bake the final HTML form
    let mut baked_html = bake_imports::bake_imports(html_cache, path, &html_from_file);
    baked_html = bake_markdown::bake_markdown(&baked_html);

    // Write the baked file to disk
    if let Some(path_as_str) = path.to_str() {
      // Build the output path
      let final_path_string = path_as_str.replacen("src", "dist", 1);
      let final_path = std::path::PathBuf::from(&final_path_string);
      if let Some(final_path_directories) = final_path.parent() {
        // Create the directories we need if they don't exist yet:
        fs::create_dir_all(&final_path_directories)
          .expect("Could not create directories for the dist folder");
        // Grab the final HTML from our cache:
        let baked_html_to_write = html_cache.get(path).expect("Must exist");
        // Write the file:
        fs::write(final_path, baked_html_to_write).expect("Unable to write file");
      }
    }

    return baked_html;
  } else {
    panic!("Warning: could not find HTML file for import {:?}", path);
  }
}
