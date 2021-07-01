// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".container{max-width:1500px;width:88%;margin:0 auto}html{font-size:10px;font-family:\"Nunito\",sans-serif}body{margin:0;padding:0;font-size:1rem;background:red}body#index{font-size:1.4rem}body#country{font-size:1.6rem}*,*::after,*::before{margin:0;padding:0;box-sizing:border-box}img{max-width:100%}ul{list-style:none}a{text-decoration:none}button{cursor:pointer;border:none}p{line-height:140%;hyphens:auto}body{min-height:100vh;text-rendering:optimizeSpeed}img,picture{max-width:100%;display:block}input,button,textarea,select{font:inherit}@media(prefers-reduced-motion: reduce){html:focus-within{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}}img{width:100px !important;height:100px !important}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}