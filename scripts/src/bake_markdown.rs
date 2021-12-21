use gray_matter::engine::YAML;
use gray_matter::Matter;
use pulldown_cmark::{html, Options, Parser};

pub fn bake_markdown(raw_md: String, template_raw_html: String) -> Option<String> {
  // Parse out frontmatter
  let matter_parser = Matter::<YAML>::new();
  let structured_post = matter_parser.parse(&raw_md);

  if structured_post.data.as_ref().is_none() {
    println!("MD file is missing its metadata, title, author, and publish_date are required");
    return None;
  }

  let title = structured_post.data.as_ref().unwrap()["title"]
    .as_string()
    .expect("Could not find title data in markdown");
  let author = structured_post.data.as_ref().unwrap()["author"]
    .as_string()
    .expect("Could not find author data in markdown");
  let publish_date = structured_post.data.as_ref().unwrap()["publish_date"]
    .as_string()
    .expect("Could not find publish_date data in markdown");

  // Set up options and markdown parser
  let mut options = Options::empty();
  options.insert(Options::ENABLE_STRIKETHROUGH);
  // This will hold the baked html:
  let mut baked_html: String = String::with_capacity(raw_md.len() * 3 / 2);
  // Turn the MD into HTML
  let parser = Parser::new_ext(structured_post.content.trim(), options);
  html::push_html(&mut baked_html, parser);

  // Pop the markdown into the right place in the HTML
  let final_html = template_raw_html
    .replace("{{ title }}", &title)
    .replace("{{ author }}", &author)
    .replace("{{ publish_date }}", &publish_date)
    // Make sure to keep the big one last since each replace is a fresh allocation
    .replace("{{ markdown_content }}", &baked_html);

  return Some(final_html);
}
