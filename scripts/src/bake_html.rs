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
  fs::write("./foo.html", baked_html).expect("Unable to write file");
}
