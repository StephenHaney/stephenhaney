use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

/// This function extracts all <import>'s out of the HTML and replaces them
pub fn bake_imports(source_path: &PathBuf, raw_html: String) -> String {
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
    let attributes: &mut HashMap<String, String> = &mut HashMap::new();
    parse_attributes_into_map(attributes, import_with_attributes);

    // Build out the full path to the src file:
    let full_import_path = &mut source_path.clone();
    if attributes.contains_key("src") == false {
      panic!(
        "HTML import must contain src attribute, parsing file: {:?} found import: {:?}",
        full_import_path, import_with_attributes
      );
    }
    // Grab the HTML from the file to insert, both the src path:
    let src_path = std::path::PathBuf::from(&attributes["src"]);
    // Pop the file name off the HTML file path we're parsing
    full_import_path.pop();
    // Join on the src path we found in the HTML attribute
    full_import_path.push(src_path);

    let mut baked_import_html = String::from("");
    // Pull the file from the FS and recursively bake it for imports:
    if let Ok(raw_import_html) = fs::read_to_string(&full_import_path) {
      baked_import_html = bake_imports(&full_import_path, raw_import_html);

      // Replace any attribute specifying {{ template }} -> baked values
      for (key, value) in attributes {
        if key == "src" {
          continue;
        }
        let template_key = String::from(format!("{{{{{} }}}}", key));
        baked_import_html = baked_import_html.replace(&template_key, &value);
      }
    } else {
      println!("Could not find HTML import: {:?}", full_import_path);
    }

    // Reassemble the HTML into the baked contents
    baked_html.push_str(prepend);
    baked_html.push_str(&baked_import_html);
    // Keep parsing through what remains
    working_string = String::from(append);
  }

  // Whatever's left of working_string can be inserted now
  baked_html.push_str(&working_string);

  return baked_html;
}

/// turns a string like <import src="something" arg="something" /> into { src: "something", arg: "something" }
fn parse_attributes_into_map(map: &mut HashMap<String, String>, raw_attributes: &str) {
  let this_attribute_name = &mut String::new();
  let this_attribute_value = &mut String::new();
  let mut found_first_quote = false;

  let search_string = raw_attributes.replace("<import ", "");
  for char in search_string.trim().chars() {
    if found_first_quote == false {
      if char == '=' {
        continue;
      }
      if char == '"' {
        // First quote
        found_first_quote = true;
        continue;
      }
      // No quotes yet, attribute name
      this_attribute_name.push(char);
    } else {
      if char == '"' {
        // Last quote, we're done
        map.insert(
          this_attribute_name.to_string(),
          this_attribute_value.to_string(),
        );
        this_attribute_name.clear();
        this_attribute_value.clear();
        found_first_quote = false;
        continue;
      }
      // Between first quote and last one, value
      this_attribute_value.push(char);
    }
  }
}
