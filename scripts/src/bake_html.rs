use std::fs;

mod bake_imports;
mod bake_markdown;

pub fn bake_html_file(path: &std::path::PathBuf) {
  println!("Parsing path {:?}", path);

  // Load the HTML from the file system
  let html_from_file = fs::read_to_string(path).expect("Something went wrong reading the file");
  // Move through our logic to bake the final HTML form
  let mut baked_html = bake_imports::bake_imports(path, &html_from_file);
  baked_html = bake_markdown::bake_markdown(&baked_html);

  // Write the baked file
  if let Some(path_as_str) = path.to_str() {
    // Build the output path
    let final_path_string = path_as_str.replacen("src", "dist", 1);
    let final_path = std::path::PathBuf::from(&final_path_string);
    if let Some(final_path_directories) = final_path.parent() {
      // Create the directories we need if they don't exist yet:
      fs::create_dir_all(&final_path_directories)
        .expect("Could not create directories for the dist folder");
      // Write the file:
      fs::write(final_path, baked_html).expect("Unable to write file");
    }
  }
}
