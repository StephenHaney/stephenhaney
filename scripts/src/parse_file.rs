use std::collections::HashMap;
use std::fs;

struct HTMLAttribute {
  name: String,
  value: String,
}

pub fn parse_file(path: &std::path::PathBuf) {
  println!("Parsing path {:?}", path);

  let mut baked_html: String = "".to_owned();
  let mut raw_html = fs::read_to_string(path).expect("Something went wrong reading the file");

  // This section extracts all <import>'s out of the HTML and replaces them
  while let Some(index_of_import) = raw_html.find("<import") {
    let start_of_import = index_of_import;
    // Grab the string before the import we found
    let prepend = &raw_html[0..start_of_import];
    let rest_of_string = &raw_html[start_of_import + 1..];
    // +2 is the size of />
    let import_length = 2
      + rest_of_string
        .find("/>")
        .expect("Malformed <import, cannot find ending />");
    let import_with_attributes = &raw_html[start_of_import..start_of_import + import_length + 1];
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

    let mut html_to_insert = String::from("");
    if attributes.contains_key("src") {
      // Grab the HTML from the file to insert
      let src_path = std::path::PathBuf::from(&attributes["src"]);
      let mut full_import_path = path.clone();

      // Pop the file name off the HTML file path we're parsing
      full_import_path.pop();
      // Join on the src path we found in the
      full_import_path.push(src_path);

      if let Ok(import_raw_html) = fs::read_to_string(&full_import_path) {
        html_to_insert = import_raw_html.clone();
      } else {
        println!(
          "Warning: could not find HTML file for import {:?}",
          full_import_path
        )
      }
    }

    // Reassemble the HTML into the baked contents
    baked_html.push_str(prepend);
    baked_html.push_str(&html_to_insert);
    // Keep parsing through what remains
    raw_html = String::from(append);
  }

  // Whatever's left of raw_html can be inserted now
  baked_html.push_str(&raw_html);

  fs::write("./foo.html", baked_html).expect("Unable to write file");
}

// Takes an unparsed attribute chunk like abc="def" and turns it into
// attribute name and attribute value
fn parse_attribute(raw_attribute: &str) -> Option<HTMLAttribute> {
  let index_of_equals = raw_attribute.find("=");

  match index_of_equals {
    None => return None,
    _ => {
      let parsed = HTMLAttribute {
        name: String::from(&raw_attribute[..index_of_equals.unwrap()]),
        value: String::from(&raw_attribute[index_of_equals.unwrap() + 1..]).replace("\"", ""),
      };

      return Option::from(parsed);
    }
  }
}
