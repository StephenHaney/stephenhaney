use super::bake_html_file_to_cache_and_fs;
use std::collections::HashMap;
use std::path::PathBuf;

/// This function extracts all <import>'s out of the HTML and replaces them
pub fn bake_imports(
  html_cache: &mut HashMap<PathBuf, String>,
  import_path: &std::path::PathBuf,
  raw_html: &str,
) -> String {
  // This string starts as the entire raw_html and gets chopped down as we move through it
  let mut working_string = raw_html.to_owned();
  // baked_html is the finished return string that we work towards
  let mut baked_html: String = String::from("");

  while let Some(index_of_import) = working_string.find("<import") {
    // Grab the string before the import we found
    let prepend = &working_string[0..index_of_import];
    let rest_of_string = &working_string[index_of_import + 1..];
    // +2 is the size of />
    let import_length = 2
      + rest_of_string
        .find("/>")
        .expect("Malformed <import, cannot find ending />");
    let import_with_attributes =
      &working_string[index_of_import..index_of_import + import_length + 1];
    // Grab the rest of the string after the /> of the import)
    let append = &rest_of_string[import_length..];

    // Build out the attributes into structured data like { name = "src", value="/some/file.html" }
    let attributes_list = import_with_attributes.split(" ");
    let mut attributes = HashMap::new();
    for raw_attribute_string in attributes_list {
      let parsed = parse_attribute(raw_attribute_string);
      if parsed.is_some() {
        let attr = parsed.unwrap();
        attributes.insert(attr.name, attr.value);
      }
    }

    // Build out the full path to the src file:
    let full_import_path = &mut import_path.clone();
    // Grab the src html file and pop it into the baked_html
    if attributes.contains_key("src") {
      // Grab the HTML from the file to insert, both the src path:
      let src_path = std::path::PathBuf::from(&attributes["src"]);
      // Pop the file name off the HTML file path we're parsing
      full_import_path.pop();
      // Join on the src path we found in the HTML attribute
      full_import_path.push(src_path);

      // If we do not already this path's html cached, we need to pull it from the file system and bake it recursively
      if html_cache.contains_key(full_import_path) == false {
        bake_html_file_to_cache_and_fs(html_cache, &full_import_path);
      }
    }

    // Reassemble the HTML into the baked contents
    baked_html.push_str(prepend);
    baked_html.push_str(
      &html_cache
        .get(full_import_path)
        .unwrap_or(&String::from("")),
    );
    // Keep parsing through what remains
    working_string = String::from(append);
  }

  // Whatever's left of working_string can be inserted now
  baked_html.push_str(&working_string);

  return baked_html;
}

// Takes an unparsed attribute chunk like abc="def" and turns it into
// attribute name and attribute value
fn parse_attribute(raw_attribute: &str) -> Option<HTMLAttribute> {
  if let Some(index_of_equals) = raw_attribute.find("=") {
    let parsed = HTMLAttribute {
      name: String::from(&raw_attribute[..index_of_equals]),
      value: String::from(&raw_attribute[index_of_equals + 1..]).replace("\"", ""),
    };

    return Option::from(parsed);
  } else {
    return None;
  }
}

struct HTMLAttribute {
  name: String,
  value: String,
}
