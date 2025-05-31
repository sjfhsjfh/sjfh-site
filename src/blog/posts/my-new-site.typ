#import "@preview/cheq:0.2.2": checklist

#import "../lib.typ": post

#show: post.with(
  created: datetime(year: 2025, month: 5, day: 30),
  title: "个人网站建站小记",
  abstract: "I use Typst btw.",
)
#show: checklist

= 公式化博客的又一次尝试？

在这之前尝试过两次自己部署博客站，最终因为自己的懒惰根本没有内容产出，网站也因而荒废了。想来也是那时候没有意识到内容产出于自己的意义，博客站也就权当是一个玩具，把玩一番后就丢在一边。

在学校里浑浑噩噩地荒废了三年光阴后，实在是觉得自己有必要留下一点什么。又一次尝试建一个个人网站，不仅是博客，其余有趣的小玩意也可以囊括其中。恰巧对#link("https://typst.app/")[Typst]处于狂热状态，遂决定当作一个技术任务来完成。

= 技术选型

接触到#link("https://astro.build/")[Astro]，在有一些 Vue 使用经历的情况下觉得还算优雅，网友们也没有过多批评这个工具，便自然而然地选择了它作为前端框架。

Typst作为文档写作的工具，实则应当主要替代Markdown，提供相当一部分便利：公式、美丽的图片、丰富的package生态和高质量的排版。但对于博客来说，最终生成的应当大部分还是HTML，因此其能控制的排版内容相当有限。

= 建站任务

- [x] 写一个主页，放点简单信息
- [ ] 使Typst文档能正常显示
  - [x] 能看见字
  - [x] 基础语义结构转换（heading一类）
  - [ ] 博客内目录
  - [ ] reflink，页内跳转
  - [ ] 公式等无法直接转换的用svg（文字尽量可复制）
  - [ ] figure及其caption
  - [ ] latin-cjk space问题
- [ ] 用Collection正确管理博客文章
  - [x] 基础的Collection结构
  - [x] 显示编译信息（warning和error）
  - [x] Dev时能监测文件变更刷新（全量编译就全量吧）
  - [ ] 写一个查询页（搜索，分页和筛选）
- [ ] 搬运以前的博客
  - [ ] 扩充meta信息
