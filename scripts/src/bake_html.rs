use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

mod bake_imports;
mod bake_markdown;

// Runs all processing we need to turn a raw HTML file into a finished, polished file, ready for prod
pub fn bake_html_file(html_cache: &HashMap<PathBuf, String>, path: &std::path::PathBuf) -> String {
  println!("Building {:?}", &path);

  // Load the HTML from the file system
  if let Ok(html_from_file) = fs::read_to_string(path) {
    // Move through our logic to bake the final HTML form
    let mut baked_html = bake_imports::bake_imports(html_cache, path, &html_from_file);
    baked_html = bake_markdown::bake_markdown(&baked_html);
    return baked_html;
  } else {
    panic!("Warning: could not find HTML file for import {:?}", path);
  }
}
