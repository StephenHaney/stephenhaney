use pulldown_cmark::{html, Options, Parser};

/// Take HTML with markdown inside it and turn it into pure HTML
pub fn bake_markdown(raw_html: &str) -> String {
  // Set up options and parser, turn on strikethroughs
  let mut options = Options::empty();
  options.insert(Options::ENABLE_STRIKETHROUGH);

  // This string starts as the entire raw_html and gets chopped down as we move through it
  let mut working_string = raw_html.to_owned();
  // baked_html is the finished return string that we work towards
  let mut baked_html: String = String::from("");

  while let Some(index_of_markdown) = working_string.find("<pre markdown>") {
    // Grab the string before the import we found
    let prepend_string = &working_string[0..index_of_markdown];
    let rest_of_string = &working_string[index_of_markdown + 1..];
    // +11 is the size of </pre markdown>
    let import_length = 15
      + rest_of_string
        .find("</pre markdown>")
        .expect("Malformed <markdown>, cannot find ending </markdown>");

    let markdown_string = &working_string[index_of_markdown..index_of_markdown + import_length + 1]
      .replace("<pre markdown>", "")
      .replace("</pre markdown>", "");

    // The baked markdown into HTML to insert
    let mut html_output: String = String::with_capacity(markdown_string.len() * 3 / 2);
    // Turn the MD into HTML
    let parser = Parser::new_ext(markdown_string.trim(), options);
    html::push_html(&mut html_output, parser);
    // Grab the rest of the string after the /> of the import)
    let append_string = &rest_of_string[import_length..];

    // Reassemble the HTML into the baked contents
    baked_html.push_str(prepend_string);
    println!("{}", &html_output);
    baked_html.push_str(&html_output);
    // Keep parsing through what remains
    working_string = String::from(append_string);
  }

  // Whatever's left of working_string can be inserted now
  baked_html.push_str(&working_string);

  return baked_html;
}
