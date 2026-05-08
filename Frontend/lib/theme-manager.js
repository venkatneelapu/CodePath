export const themes = {
  dracula: {
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    card: '#3d3f47',
    code_bg: '#1e1f2e',
    code_text: '#f8f8f2',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    function: '#8be9fd',
    comment: '#6272a4',
  },
  nord: {
    name: 'Nord',
    background: '#2e3440',
    foreground: '#eceff4',
    card: '#3b4252',
    code_bg: '#2e3440',
    code_text: '#eceff4',
    keyword: '#81a1c1',
    string: '#a3be8c',
    function: '#88c0d0',
    comment: '#616e88',
  },
  solarized: {
    name: 'Solarized',
    background: '#002b36',
    foreground: '#839496',
    card: '#073642',
    code_bg: '#002b36',
    code_text: '#839496',
    keyword: '#859900',
    string: '#2aa198',
    function: '#268bd2',
    comment: '#586e75',
  },
  monokai: {
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    card: '#3e3d32',
    code_bg: '#272822',
    code_text: '#f8f8f2',
    keyword: '#f92672',
    string: '#e6db74',
    function: '#a1efe4',
    comment: '#75715e',
  },
};

export function applyTheme(themeName) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('theme-dracula', 'theme-nord', 'theme-solarized', 'theme-monokai');
  root.classList.add(`theme-${themeName}`);
  
  const theme = themes[themeName];
  if (theme) {
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--code-bg', theme.code_bg);
    root.style.setProperty('--code-text', theme.code_text);
    root.style.setProperty('--code-string', theme.string);
    root.style.setProperty('--code-keyword', theme.keyword);
    root.style.setProperty('--code-function', theme.function);
    root.style.setProperty('--code-comment', theme.comment);
  }
  
  localStorage.setItem('selectedTheme', themeName);
}

export function getSelectedTheme() {
  if (typeof window === 'undefined') return 'dracula';
  return localStorage.getItem('selectedTheme') || 'dracula';
}

export function setCustomBackground(imageUrl) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--custom-bg', `url('${imageUrl}')`);
  localStorage.setItem('customBackground', imageUrl);
}

export function getCustomBackground() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('customBackground') || null;
}

export function highlightCode(code, language) {
  let highlighted = code;
  
  const keywords = {
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'True', 'False', 'None'],
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'class', 'async', 'await'],
    java: ['public', 'private', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'new', 'static', 'final', 'void'],
    cpp: ['int', 'float', 'double', 'void', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'using', 'namespace'],
  };
  
  const langKeywords = keywords[language.toLowerCase()] || [];
  
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="code-keyword">${keyword}</span>`);
  });
  
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>');
  highlighted = highlighted.replace(/'([^']*)'/g, "<span class=\"code-string\">'$1'</span>");
  highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>');
  highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>');
  
  return highlighted;
}
