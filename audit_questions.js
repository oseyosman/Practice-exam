const fs = require('fs');
const text = fs.readFileSync('./questions.js', 'utf8');
// Execute the file to get CYSA_QUESTIONS into scope
const vm = require('vm');
const ctx = { module: {}, exports: {} };
vm.createContext(ctx);
vm.runInContext(text, ctx);

const CYSA_QUESTIONS = ctx.CYSA_QUESTIONS;
console.log('Total questions:', CYSA_QUESTIONS.length);

let issues = [];
let placeholderQs = [];
let numberedQs = []; // questions like A.1, B.2 (from image-based drag-drop questions)

CYSA_QUESTIONS.forEach(q => {
  if(q.type !== 'mcq') return;
  let hasPlaceholder = false;
  let hasNumbered = false;
  (q.options||[]).forEach((opt, i) => {
    const raw = opt.replace(/^[A-F]\.\s*/,'').trim();
    // Blank or too short
    if(!raw || raw.length < 2) {
      issues.push({id:q.id, i, opt, reason:'blank/empty'});
    }
    // Placeholder like 'Option A'
    if(/^Option [A-F]$/.test(raw)) {
      hasPlaceholder = true;
      issues.push({id:q.id, i, opt, reason:'placeholder'});
    }
    // Number-only options like A.1, B.2 (image ordering questions)
    if(/^\d+$/.test(raw)) {
      hasNumbered = true;
      issues.push({id:q.id, i, opt, reason:'number-only (image drag-drop)'});
    }
  });
  if(hasPlaceholder) placeholderQs.push(q.id);
  if(hasNumbered) numberedQs.push(q.id);
});

if(issues.length === 0) {
  console.log('✓ No bad options found — all questions look clean!');
} else {
  console.log('Issues found:', issues.length);
  issues.forEach(x => {
    console.log(' ', x.id, '| opt['+x.i+'] ('+x.reason+'):', JSON.stringify(x.opt).slice(0,80));
  });
  if(placeholderQs.length) {
    console.log('\nQuestions with placeholder options (simulation/PBQ-type without real options):');
    placeholderQs.forEach(id => console.log(' -', id));
  }
  if(numberedQs.length) {
    console.log('\nQuestions with number-only options (image ordering drag-drop):');
    numberedQs.forEach(id => console.log(' -', id));
  }
}
