#import "@preview/zebraw:0.5.2": zebraw, zebraw-init, zebraw-themes

#import "html-elems.typ": code, del, pre, span

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

  // Strike html fix
  show strike: it => span(del(it))

  // Raw html fix
  show raw.where(block: false): it => span(pre(code(it)))
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
