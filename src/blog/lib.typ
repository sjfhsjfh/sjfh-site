#import "template.typ"

#let format-datetime(dt) = {
  if type(dt) == datetime {
    return dt.display()
  }
}

#let post(
  doc,
  title: "TITLE PLACEHOLDER",
  lang: "zh",
  created: none,
  updated: none,
) = {
  let front-matter = (
    title: title,
    created: format-datetime(created),
    updated: format-datetime(updated),
  )
  show: template.config.with(
    lang: lang,
    title: title,
    fonts: ("Sentinel Pro", "Source Han Serif SC"),
  )
  [#metadata(front-matter)<front-matter>]
  doc
}
