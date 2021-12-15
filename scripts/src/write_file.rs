use std::fs;

/// Writes a file to the fs once it's fully baked
pub fn write_file(source_path: &std::path::PathBuf, file_contents: &str) {
  // Build the dist path for this file
  let dist_path_str = source_path
    .to_str()
    .expect("Could not convert src path correctly")
    .replacen("src", "dist", 1);
  let dist_path = std::path::PathBuf::from(&dist_path_str);

  // Create directories if we need to
  fs::create_dir_all(
    &dist_path
      .parent()
      .expect("Could not build dist folder structure"),
  )
  .expect("Could not create directories for the dist folder");

  fs::write(dist_path, file_contents).expect("Unable to write file");
}
