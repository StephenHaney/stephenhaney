use std::fs;

/// Copies a file directly from src to dist without any changes
pub fn copy_file(path: &std::path::PathBuf) {
  println!("Copying {:?}", path);
  // Build the dist path for this file
  let dist_path_str = path
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

  // Make the copy
  fs::copy(path, dist_path).expect("Could not copy file correctly");
}
