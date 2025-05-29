#import "@preview/zebraw:0.5.2": zebraw, zebraw-init, zebraw-themes

#let config(
  doc,
  lang: "en",
  title: "TITLE PLACEHOLDER",
  fonts: (),
) = {
  set document(title: title)
  set text(lang: lang, font: fonts)
  set par(
    first-line-indent: (
      all: true,
      amount: 2em,
    ),
    justify: true,
  )

  show raw.where(block: true): it => {
    if it.lang in ("sh", "txt") {
      zebraw(it, numbering: false)
    } else {
      zebraw(it)
    }
  }

  zebraw-init(
    none,
    // ..zebraw-themes.zebra,
    lang: false,
  )

  doc
}
